import type { AvailabilityWindow, Booking, Schedule } from "@/types/scheduler";
import { getServiceSupabase } from "@/lib/supabaseServer";
import { randomToken, slugify } from "@/lib/slug";

export async function getScheduleBySlug(slug: string): Promise<Schedule> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("schedules")
    .select("id, owner_id, slug, title, timezone, edit_token, created_at")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    throw Object.assign(new Error("Schedule not found"), { status: 404 });
  }

  return data as Schedule;
}

export async function getAvailabilityWindows(scheduleId: string): Promise<AvailabilityWindow[]> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("availability_windows")
    .select("id, schedule_id, weekday, start_minute, end_minute, slot_minutes, created_at")
    .eq("schedule_id", scheduleId)
    .order("weekday", { ascending: true })
    .order("start_minute", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as AvailabilityWindow[];
}

export async function getBookings(scheduleId: string, fromIso: string, toIso: string): Promise<Booking[]> {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, schedule_id, start_ts, end_ts, guest_name, guest_phone, status, hold_expires_at, created_at")
    .eq("schedule_id", scheduleId)
    .eq("status", "booked")
    .gte("start_ts", fromIso)
    .lt("end_ts", toIso);

  if (error) {
    throw error;
  }

  return (data ?? []) as Booking[];
}

export async function rotateEditToken(scheduleId: string): Promise<string> {
  const supabase = getServiceSupabase();
  const token = randomToken(40);
  const { error } = await supabase
    .from("schedules")
    .update({ edit_token: token })
    .eq("id", scheduleId);

  if (error) {
    throw error;
  }

  return token;
}

export async function updateScheduleSettings(scheduleId: string, values: Partial<Pick<Schedule, "title" | "timezone">>) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("schedules")
    .update(values)
    .eq("id", scheduleId)
    .select("id, slug, title, timezone, edit_token")
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to update schedule");
  }

  return data as Schedule;
}

export async function upsertAvailabilityWindows(scheduleId: string, windows: Array<{
  id?: string;
  weekday: number;
  startMinute: number;
  endMinute: number;
  slotMinutes: number;
}>) {
  const supabase = getServiceSupabase();

  if (windows.length) {
    const payload = windows.map((window) => ({
      id: window.id,
      schedule_id: scheduleId,
      weekday: window.weekday,
      start_minute: window.startMinute,
      end_minute: window.endMinute,
      slot_minutes: window.slotMinutes
    }));

    const { error } = await supabase.from("availability_windows").upsert(payload, {
      onConflict: "id"
    });

    if (error) {
      throw error;
    }
  }
}

export async function deleteAvailabilityWindows(windowIds: string[], scheduleId: string) {
  if (!windowIds.length) {
    return;
  }
  const supabase = getServiceSupabase();
  const { error } = await supabase
    .from("availability_windows")
    .delete()
    .in("id", windowIds)
    .eq("schedule_id", scheduleId);

  if (error) {
    throw error;
  }
}

export async function ensureSlugUnique(base: string): Promise<string> {
  const supabase = getServiceSupabase();
  let slug = slugify(base);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, error } = await supabase
      .from("schedules")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return slug;
    }

    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  throw new Error("Unable to generate unique slug");
}
