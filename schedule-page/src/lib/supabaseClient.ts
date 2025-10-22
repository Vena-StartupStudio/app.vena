import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { env } from "./env"

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export function createPublicSupabaseClient(publicToken: string): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        'X-Public-Token': publicToken
      }
    }
  })
}
