// db.ts
import { Pool } from "pg";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    // read CA from your env path (PGSSLROOTCERT=./ca.pem)
    ca: process.env.PGSSLROOTCERT
      ? fs.readFileSync(process.env.PGSSLROOTCERT, "utf8")
      : undefined,
  },
});

export async function ping() {
  const { rows } = await pool.query("SELECT NOW() AS now");
  return rows[0].now;
}
