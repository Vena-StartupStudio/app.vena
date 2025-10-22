import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const demoEmail = process.env.SCHEDULER_DEMO_OWNER_EMAIL ?? "owner@example.com";
const demoPassword = process.env.SCHEDULER_DEMO_OWNER_PASSWORD ?? "DemoPassword123!";
const demoTitle = "Demo Schedule";

// Debug logging
console.log("Environment variables loaded:");
console.log("SUPABASE_URL:", url ? `${url.slice(0, 30)}...` : "NOT SET");
console.log("SUPABASE_SERVICE_ROLE_KEY:", serviceKey ? `${serviceKey.slice(0, 20)}...` : "NOT SET");

if (!url || !serviceKey) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

function randomSuffix(length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = slugify(base);
  for (let attempts = 0; attempts < 5; attempts += 1) {
    const { data, error } = await supabase
      .from("schedules")
      .select("slug")
      .eq("slug", candidate)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return candidate;
    }

    candidate = `${candidate}-${randomSuffix(4)}`;
  }

  throw new Error("Unable to produce unique slug");
}

function generateEditToken(size = 40) {
  return crypto.randomBytes(size).toString("hex").slice(0, size);
}

async function upsertDemoOwner() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: demoEmail,
    password: demoPassword,
    email_confirm: true
  });

  if (error) {
    if (error.message.includes("already been registered") || error.message.includes("User already registered")) {
      console.log("Demo user already exists, finding existing user...");
      const existing = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 200
      });
      const user = existing.data.users.find((u) => u.email === demoEmail);
      if (!user) {
        throw new Error(`Unable to locate existing demo user ${demoEmail}`);
      }
      console.log(`Found existing demo user: ${user.id}`);
      return user.id;
    }
    throw error;
  }

  if (!data?.user) {
    throw new Error("Failed to create demo owner");
  }

  return data.user.id;
}

async function main() {
  console.log("Seeding demo scheduler data...");
  const ownerId = await upsertDemoOwner();

  const { data: existingSchedule } = await supabase
    .from("schedules")
    .select("id, slug, edit_token")
    .eq("owner_id", ownerId)
    .maybeSingle();

  let schedule;
  let scheduleError;

  if (existingSchedule) {
    // Update existing schedule
    console.log("Updating existing schedule...");
    const { data, error } = await supabase
      .from("schedules")
      .update({
        title: demoTitle,
        timezone: "Asia/Jerusalem"
      })
      .eq("id", existingSchedule.id)
      .select("id, slug, edit_token")
      .single();
    
    schedule = data;
    scheduleError = error;
  } else {
    // Create new schedule
    console.log("Creating new schedule...");
    const slug = await ensureUniqueSlug(demoTitle);
    const editToken = generateEditToken();
    
    const { data, error } = await supabase
      .from("schedules")
      .insert({
        owner_id: ownerId,
        slug,
        title: demoTitle,
        timezone: "Asia/Jerusalem",
        edit_token: editToken
      })
      .select("id, slug, edit_token")
      .single();
    
    schedule = data;
    scheduleError = error;
  }

  if (scheduleError) {
    throw scheduleError;
  }

  if (!schedule) {
    throw new Error("Failed to create or update schedule");
  }

  const windows = [
    { weekday: 2, start_minute: 9 * 60, end_minute: 12 * 60, slot_minutes: 30 },
    { weekday: 3, start_minute: 13 * 60, end_minute: 17 * 60, slot_minutes: 30 },
    { weekday: 5, start_minute: 10 * 60, end_minute: 15 * 60, slot_minutes: 45 }
  ].map((window) => ({ ...window, schedule_id: schedule.id }));

  const { error: windowCleanupError } = await supabase
    .from("availability_windows")
    .delete()
    .eq("schedule_id", schedule.id);

  if (windowCleanupError) {
    throw windowCleanupError;
  }

  const { error: insertError } = await supabase
    .from("availability_windows")
    .insert(windows);

  if (insertError) {
    throw insertError;
  }

  console.log("Demo scheduler seeded.");
  console.log(`Public booking URL: /s/${schedule.slug}`);
  console.log(`Editor URL token: ${schedule.edit_token}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});