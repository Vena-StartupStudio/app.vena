import { NextRequest } from "next/server";
import { SettingsUpdateSchema } from "@/lib/validators";
import { errorResponse, json } from "@/lib/http";
import { getScheduleBySlug, updateScheduleSettings } from "@/lib/scheduler";
import { requireOwnerAccess } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const schedule = await getScheduleBySlug(params.slug);
    await requireOwnerAccess(schedule, request);

    return json({
      ok: true,
      schedule: {
        id: schedule.id,
        slug: schedule.slug,
        title: schedule.title,
        timezone: schedule.timezone,
        editToken: schedule.edit_token
      }
    });
  } catch (error: any) {
    if (error?.status === 403) {
      return errorResponse(403, "Forbidden", "FORBIDDEN");
    }
    if (error?.status === 404) {
      return errorResponse(404, "Schedule not found", "NOT_FOUND");
    }
    console.error("Settings GET error", error);
    return errorResponse(500, "Failed to load settings", "SERVER_ERROR");
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const schedule = await getScheduleBySlug(params.slug);
    await requireOwnerAccess(schedule, request);

    const payload = await request.json().catch(() => null);
    const parseResult = SettingsUpdateSchema.safeParse(payload);

    if (!parseResult.success) {
      return errorResponse(400, "Invalid payload", "BAD_REQUEST");
    }

    const updated = await updateScheduleSettings(schedule.id, parseResult.data);

    return json({
      ok: true,
      schedule: {
        id: updated.id,
        slug: updated.slug,
        title: updated.title,
        timezone: updated.timezone,
        editToken: updated.edit_token
      }
    });
  } catch (error: any) {
    if (error?.status === 403) {
      return errorResponse(403, "Forbidden", "FORBIDDEN");
    }
    if (error?.status === 404) {
      return errorResponse(404, "Schedule not found", "NOT_FOUND");
    }
    console.error("Settings update error", error);
    return errorResponse(500, "Failed to update settings", "SERVER_ERROR");
  }
}
