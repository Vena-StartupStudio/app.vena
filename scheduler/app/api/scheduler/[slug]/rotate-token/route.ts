import { NextRequest } from "next/server";
import { errorResponse, json } from "@/lib/http";
import { getScheduleBySlug, rotateEditToken } from "@/lib/scheduler";
import { requireOwnerAccess } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const schedule = await getScheduleBySlug(params.slug);
    await requireOwnerAccess(schedule, request);

    const token = await rotateEditToken(schedule.id);

    return json({ ok: true, editToken: token });
  } catch (error: any) {
    if (error?.status === 403) {
      return errorResponse(403, "Forbidden", "FORBIDDEN");
    }
    if (error?.status === 404) {
      return errorResponse(404, "Schedule not found", "NOT_FOUND");
    }
    console.error("Rotate token error", error);
    return errorResponse(500, "Failed to rotate token", "SERVER_ERROR");
  }
}
