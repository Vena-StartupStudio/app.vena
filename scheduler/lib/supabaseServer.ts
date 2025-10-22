import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

let serviceClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

export function getServiceSupabase(): SupabaseClient {
  if (!serviceClient) {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getEnv();
    serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return serviceClient;
}

export function getAnonSupabase(): SupabaseClient {
  if (!anonClient) {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = getEnv();
    anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return anonClient;
}

export function getRouteClient() {
  return createRouteHandlerClient({ cookies });
}

export async function getAuthenticatedUser() {
  const client = getRouteClient();
  const {
    data: { user }
  } = await client.auth.getUser();
  return { supabase: client, user };
}
