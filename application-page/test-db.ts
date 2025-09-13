import fs from "fs";
import { Client } from "pg";
import "dotenv/config";

function loadCA(): string {
  const v = (process.env.PGSSLROOTCERT || "").trim();
  if (!v) throw new Error("PGSSLROOTCERT missing");
  if (v.startsWith("-----BEGIN CERTIFICATE-----")) return v; // env contains PEM
  return fs.readFileSync(v, "utf8"); // env is a path
}

async function main() {
  const ca = loadCA();
  const host = new URL(process.env.DATABASE_URL!).hostname;
  console.log("CA loaded chars:", ca.length, "  SNI host:", host);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      ca: [ca],                 // array helps on some Node/Windows setups
      rejectUnauthorized: true, // keep ON once fixed
      servername: host,         // SNI/hostname verification
      minVersion: "TLSv1.2",
    },
    application_name: "vena-test",
  });

  try {
    await client.connect();
    const { rows } = await client.query("SELECT NOW() as now");
    console.log("✅ Connected. DB time:", rows[0].now);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.end().catch(() => {});
  }
}

main();
