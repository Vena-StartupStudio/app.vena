import { NextRequest } from "next/server";
import { BookingRequestSchema } from "@/lib/validators";
import { getScheduleBySlug } from "@/lib/scheduler";
import { getServiceSupabase } from "@/lib/supabaseServer";
import { errorResponse, json } from "@/lib/http";

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const schedule = await getScheduleBySlug(params.slug);

    const payload = await request.json().catch(() => null);
    const parseResult = BookingRequestSchema.safeParse(payload);

    if (!parseResult.success) {
      return errorResponse(400, "Invalid request payload", "BAD_REQUEST");
    }

    const { startTs, endTs, guestName, guestPhone } = parseResult.data;
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .rpc("attempt_booking", {
        p_schedule_id: schedule.id,
        p_start_ts: startTs,
        p_end_ts: endTs,
        p_guest_name: guestName,
        p_guest_phone: guestPhone
      })
      .single();

    if (error) {
      if (error.code === "23505") {
        return errorResponse(409, "Slot already booked", "SLOT_TAKEN");
      }
      const code = error.message ?? error.code;
      if (code === "SLOT_TAKEN") {
        return errorResponse(409, "Slot already booked", "SLOT_TAKEN");
      }
      if (
        code === "PAST_SLOT" ||
        code === "INVALID_SLOT_DURATION" ||
        code === "INVALID_RANGE" ||
        code === "OUTSIDE_AVAILABILITY" ||
        code === "INVALID_SLOT_ALIGNMENT"
      ) {
        return errorResponse(400, code, code);
      }
      console.error("Booking RPC error", error);
      return errorResponse(500, "Could not create booking", "SERVER_ERROR");
    }

    return json({
      ok: true,
      booking: {
        id: (data as any).id,
        startTs: (data as any).start_ts,
        endTs: (data as any).end_ts,
        status: (data as any).status
      }
    });
  } catch (error: any) {
    if (error?.status === 404) {
      return errorResponse(404, "Schedule not found", "NOT_FOUND");
    }
    console.error("Booking error", error);
    return errorResponse(500, "Could not create booking", "SERVER_ERROR");
  }
}
