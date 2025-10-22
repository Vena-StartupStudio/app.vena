import { NextRequest } from "next/server";
import { AvailabilityQuerySchema } from "@/lib/validators";
import { computeAvailability } from "@/lib/availability";
import { getAvailabilityWindows, getBookings, getScheduleBySlug } from "@/lib/scheduler";
import { errorResponse, json } from "@/lib/http";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const schedule = await getScheduleBySlug(params.slug);

    const { searchParams } = new URL(request.url);
    const parseResult = AvailabilityQuerySchema.safeParse({
      from: searchParams.get("from"),
      to: searchParams.get("to")
    });

    if (!parseResult.success) {
      return errorResponse(400, "Invalid query", "BAD_REQUEST");
    }

    const { from, to } = parseResult.data;
    const [windows, bookings] = await Promise.all([
      getAvailabilityWindows(schedule.id),
      getBookings(schedule.id, from, to)
    ]);

    const slots = computeAvailability({
      windows,
      bookings,
      fromUtc: from,
      toUtc: to,
      timezone: schedule.timezone
    });

    return json({
      ok: true,
      schedule: {
        id: schedule.id,
        slug: schedule.slug,
        title: schedule.title,
        timezone: schedule.timezone
      },
      slots,
      generatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    if (error?.status === 404) {
      return errorResponse(404, "Schedule not found", "NOT_FOUND");
    }
    console.error("Availability error", error);
    return errorResponse(500, "Failed to load availability", "SERVER_ERROR");
  }
}

