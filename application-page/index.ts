import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Aiven
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to Aiven PostgreSQL");

    const res = await client.query("SELECT NOW()");
    console.log("Server time:", res.rows[0].now);

    await client.end();
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
}

connectDB();