import React, { useState, useCallback } from 'react';
// Change to default imports
import type { FormData as RegistrationFormData, FormErrors as BaseFormErrors } from './types';

import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import {
  health,
  insertRegistration,
  listRegistrations,
  getRegistrationByEmail,
  type RegistrationRecord,
  dbFile,
} from "./sqlite.js";
import argon2 from "argon2";

// ------------ Config ------------
const PORT = Number(process.env.PORT || 3001);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN?.split(",") ?? "*";
const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(process.cwd(), "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Ensure directories exist
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ------------ App init ------------
const app = express();
const upload = multer({ dest: UPLOADS_DIR });

// CORS + parsers
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (optional)
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "7d", index: false }));

// ------------ Routes ------------

// POST /api/register (accepts JSON body with optional multipart/form-data for logo)
app.post("/api/register", upload.single("logo"), async (req: Request, res: Response) => {
  try {
    const {
      businessName,
      firstName,
      lastName,
      email,
      password, // Receive the plain-text password from the client
      socialMedia,
      businessNiche,
    } = req.body;

    // --- SERVER-SIDE VALIDATION ---
    if (!businessName || !email || !password || !businessNiche) {
      return res.status(400).json({ ok: false, error: "Missing required fields." });
    }

    const existingUser = getRegistrationByEmail(email);
    if (existingUser) {
      return res.status(409).json({ ok: false, error: "Email already registered." });
    }

    // --- HASH THE PASSWORD ON THE SERVER ---
    const passwordHash = await argon2.hash(password);

    const data: RegistrationRecord = {
      businessName,
      firstName: firstName || "",
      lastName: lastName || "",
      email,
      passwordHash, // Save the hash, not the plain password
      socialMedia: socialMedia || "",
      businessNiche,
      logoFilename: req.file?.filename || null,
    };

    const info = insertRegistration(data);
    console.log(`Registration successful for ${email}, ID: ${info.lastInsertRowid}`);

    return res.status(201).json({ ok: true, id: info.lastInsertRowid });
  } catch (err: any) {
    console.error("Registration failed:", err.message);
    return res.status(500).json({ ok: false, error: "Registration failed due to a server error." });
  }
});

// GET list
app.get(["/registrations", "/api/registrations"], (req: Request, res: Response) => {
  const limit = Number(req.query.limit ?? 50);
  const rows = listRegistrations(Number.isFinite(limit) ? limit : 50);
  res.json({ ok: true, registrations: rows });
});

// GET by email (optional helper)
app.get(["/registration", "/api/registration"], (req: Request, res: Response) => {
  const email = String(req.query.email || "");
  if (!email) return res.status(400).json({ ok: false, error: "email query param is required" });
  const row = getRegistrationByEmail(email);
  if (!row) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, registration: row });
});

// Health
app.get(["/health", "/api/health"], (_req: Request, res: Response) => {
  try {
    res.json({ ok: health() });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ------------ Start ------------
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`Database file location: ${dbFile}`);
  console.log(`Uploads: ${UPLOADS_DIR}`);
});