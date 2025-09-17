import express, { type Request, type Response, type RequestHandler } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import argon2 from "argon2";

// ESM-friendly __dirname
const __filename = fileURLToPath(import.meta.url);
// This __dirname will point to `dist/server` when running
const __dirname = path.dirname(__filename);

// --- THIS IS THE KEY CHANGE ---
// Go up ONE directory from `dist/server` to get to `dist`
const clientDistPath = path.join(__dirname, '..');

// DB helpers (compiled to .js in dist). Keep the .js extension for NodeNext/ESM.
import {
  health,
  insertRegistration,
  listRegistrations,
  getRegistrationByEmail,
  type RegistrationRecord,
  dbFile,
} from "./sqlite.js";

// ------------ Config ------------
const PORT = Number(process.env.PORT || 3001);

const rawAllowed =
  process.env.ALLOWED_ORIGIN?.split(",").map((s) => s.trim()).filter(Boolean);
const ALLOWED_ORIGIN: "*" | string[] =
  rawAllowed && rawAllowed.length > 0 ? rawAllowed : "*";

const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(process.cwd(), "uploads");

// Ensure directories exist
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ------------ App init ------------
const app = express();
const upload = multer({ dest: UPLOADS_DIR });

// CORS + parsers
app.use(
  cors({
    // If "*", let any origin access but disable credentials (browser restriction)
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN,
    credentials: ALLOWED_ORIGIN !== "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "7d", index: false }));

// Serve the built client (dist/) — needed in production on Render
app.use(express.static(clientDistPath));

// Multer wrapper: only run for multipart/form-data and cast to our Express types
const maybeUpload: RequestHandler = (req, res, next) => {
  if (req.is("multipart/form-data")) {
    return (upload.single("logo") as unknown as RequestHandler)(req, res, next);
  }
  return next();
};

// ------------ Routes ------------

// POST /api/register (accepts JSON or multipart/form-data with "logo")
app.post("/api/register", maybeUpload, async (req: Request, res: Response) => {
  try {
    const {
      businessName,
      firstName,
      lastName,
      email,
      password, // plain-text from client; we hash it here
      socialMedia,
      businessNiche,
    } = req.body as Record<string, string>;

    // --- SERVER-SIDE VALIDATION ---
    if (!businessName || !email || !password || !businessNiche) {
      return res.status(400).json({ ok: false, error: "Missing required fields." });
    }

    const existing = getRegistrationByEmail(email);
    if (existing) {
      return res.status(409).json({ ok: false, error: "Email already registered." });
    }

    // --- HASH THE PASSWORD ON THE SERVER ---
    const passwordHash = await argon2.hash(password);

    const record: RegistrationRecord = {
      businessName,
      firstName: firstName || "",
      lastName: lastName || "",
      email,
      passwordHash,
      socialMedia: socialMedia || "",
      businessNiche,
      logoFilename: req.file?.filename || null,
    };

    const info = insertRegistration(record);
    console.log(`Registration successful for ${email}, ID: ${info.lastInsertRowid}`);
    return res.status(201).json({ ok: true, id: info.lastInsertRowid });
  } catch (err: any) {
    console.error("Registration failed:", err?.message || err);
    return res
      .status(500)
      .json({ ok: false, error: "Registration failed due to a server error." });
  }
});

// List registrations
app.get(["/api/registrations", "/registrations"], (req: Request, res: Response) => {
  const limit = Number(req.query.limit ?? 50);
  const rows = listRegistrations(Number.isFinite(limit) ? limit : 50);
  res.json({ ok: true, registrations: rows });
});

// Get by email
app.get(["/api/registration", "/registration"], (req: Request, res: Response) => {
  const email = String(req.query.email || "");
  if (!email) return res.status(400).json({ ok: false, error: "email query param is required" });
  const row = getRegistrationByEmail(email);
  if (!row) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, registration: row });
});

// Health
app.get(["/api/health", "/health"], (_req: Request, res: Response) => {
  try {
    res.json({ ok: health() });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Serve signin page
app.get('/signin', (req, res) => {
  console.log('LOG: Request received for /signin. Sending signin.html.');
  res.sendFile(path.join(clientDistPath, 'signin.html'));
});

// Serve dashboard page (ProfileEditor)
app.get('/dashboard', (req, res) => {
  console.log('LOG: Request received for /dashboard. Sending dashboard.html.');
  res.sendFile(path.join(clientDistPath, 'dashboard.html'));
});

// Serve ProfileEditor assets
app.use('/dashboard', express.static(path.join(__dirname, '../dist')));

// Fallback for other routes -> index.html
app.get("*", (req, res) => {
  console.log(`LOG: Catch-all triggered for path: ${req.path}. Sending index.html.`);
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// ------------ Start ------------
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
  console.log(`Database file: ${dbFile}`);
  console.log(`Uploads dir: ${UPLOADS_DIR}`);
});
