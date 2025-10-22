import type { Schedule } from "@/types/scheduler";
import { getAuthenticatedUser } from "@/lib/supabaseServer";

export type AccessKind = "owner" | "token";

export async function requireOwnerAccess(schedule: Schedule, request: Request): Promise<AccessKind> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? request.headers.get("x-edit-token");

  if (token && token === schedule.edit_token) {
    return "token";
  }

  const { user } = await getAuthenticatedUser();

  if (user && user.id === schedule.owner_id) {
    return "owner";
  }

  throw Object.assign(new Error("Forbidden"), { status: 403 });
}

export function hasEditToken(schedule: Schedule, token: string | null | undefined) {
  return Boolean(token && token === schedule.edit_token);
}
