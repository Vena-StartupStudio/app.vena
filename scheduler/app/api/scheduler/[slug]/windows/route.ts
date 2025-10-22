import { NextRequest } from "next/server";
import { WindowsMutationSchema } from "@/lib/validators";
import { errorResponse, json } from "@/lib/http";
import {
  deleteAvailabilityWindows,
  getAvailabilityWindows,
  getScheduleBySlug,
  upsertAvailabilityWindows
} from "@/lib/scheduler";
import { requireOwnerAccess } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const schedule = await getScheduleBySlug(params.slug);
    await requireOwnerAccess(schedule, request);

    const windows = await getAvailabilityWindows(schedule.id);

    return json({ ok: true, windows });
  } catch (error: any) {
    if (error?.status === 403) {
      return errorResponse(403, "Forbidden", "FORBIDDEN");
    }
    if (error?.status === 404) {
      return errorResponse(404, "Schedule not found", "NOT_FOUND");
    }
    console.error("Windows GET error", error);
    return errorResponse(500, "Failed to load windows", "SERVER_ERROR");
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const schedule = await getScheduleBySlug(params.slug);
    await requireOwnerAccess(schedule, request);

    const payload = await request.json().catch(() => null);
    const parseResult = WindowsMutationSchema.safeParse(payload);

    if (!parseResult.success) {
      return errorResponse(400, "Invalid payload", "BAD_REQUEST");
    }

    const { upserts, deletes } = parseResult.data;

    await deleteAvailabilityWindows(deletes, schedule.id);
    await upsertAvailabilityWindows(schedule.id, upserts);

    const windows = await getAvailabilityWindows(schedule.id);

    return json({ ok: true, windows });
  } catch (error: any) {
    if (error?.code === "23505" || error?.message?.includes("window_no_overlap")) {
      return errorResponse(400, "Overlapping windows", "WINDOW_OVERLAP");
    }
    if (error?.status === 403) {
      return errorResponse(403, "Forbidden", "FORBIDDEN");
    }
    if (error?.status === 404) {
      return errorResponse(404, "Schedule not found", "NOT_FOUND");
    }
    console.error("Windows POST error", error);
    return errorResponse(500, "Failed to update windows", "SERVER_ERROR");
  }
}
