import express from "express";
import { pool, ping } from "./db";

const app = express();
app.use(express.json());

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    const now = await ping();
    res.json({ ok: true, now });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Read rows from public.registrations
app.get("/api/registrations", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, business_na, first_name, last_name, email, social_media,
             business_nic, logo_filename, created_at
      FROM public.registrations
      ORDER BY id DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Create a registration (example)
app.post("/api/registrations", async (req, res) => {
  const { business_na, first_name, last_name, email, social_media, business_nic, logo_filename } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO public.registrations
       (business_na, first_name, last_name, email, social_media, business_nic, logo_filename, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7, NOW())
       RETURNING *`,
      [business_na, first_name, last_name, email, social_media, business_nic, logo_filename]
    );
    res.status(201).json(rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
