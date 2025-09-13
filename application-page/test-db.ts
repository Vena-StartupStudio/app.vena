import fs from "fs";
import path from "path";
import { Client } from "pg";
import "dotenv/config";

function loadCA(): string | undefined {
  const certEnv = process.env.PGSSLROOTCERT;
  
  if (!certEnv) {
    console.log("No PGSSLROOTCERT specified");
    return undefined;
  }
  
  // If the env variable contains the PEM content directly (for Render)
  if (certEnv.startsWith("-----BEGIN CERTIFICATE-----")) {
    console.log("✓ Using CA from environment variable");
    return certEnv;
  }
  
  // Try to read from file path (for local development)
  try {
    const fullPath = path.resolve(certEnv);
    console.log("✓ Loading CA from file:", fullPath);
    return fs.readFileSync(fullPath, "utf8");
  } catch (error) {
    console.error("❌ Could not load CA from file:", error);
    return undefined;
  }
}

async function main() {
  console.log("🚀 Starting database connection test...");
  
  const ca = loadCA();
  const connectionConfig: any = {
    connectionString: process.env.DATABASE_URL,
    application_name: "vena-app",
  };

  if (ca) {
    connectionConfig.ssl = {
      ca,
      rejectUnauthorized: true,
    };
    console.log("🔒 SSL configured with CA certificate");
  } else {
    connectionConfig.ssl = {
      rejectUnauthorized: false,
    };
    console.log("⚠️ SSL configured without CA verification");
  }

  const client = new Client(connectionConfig);

  try {
    console.log("🔌 Connecting to database...");
    await client.connect();
    
    const { rows } = await client.query("SELECT NOW() as now, version() as version");
    console.log("✅ DATABASE CONNECTION SUCCESSFUL!");
    console.log("📅 DB time:", rows[0].now);
    console.log("🗄️ DB version:", rows[0].version.split(" ")[0]);
    
  } catch (err) {
    console.error("❌ DATABASE CONNECTION FAILED:", err);
    
    // Debug information
    if (err instanceof Error) {
      console.log("\n🔍 Debug Information:");
      console.log("- Error code:", (err as any).code);
      console.log("- CA loaded:", ca ? "✓ Yes" : "❌ No");
      console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "✓ Set" : "❌ Missing");
      console.log("- Environment:", process.env.NODE_ENV || "development");
    }
  } finally {
    await client.end().catch(() => {});
    console.log("🔌 Database connection closed");
  }
}

main();