const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const edgeBaseUrl = import.meta.env.VITE_EDGE_BASE_URL as string | undefined
const bookingBaseUrl = import.meta.env.VITE_PUBLIC_BOOKING_BASE_URL as string | undefined
const defaultTimezone = (import.meta.env.VITE_DEFAULT_TIMEZONE as string | undefined) ?? 'Europe/Berlin'

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not set')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not set')
}

export const env = {
  supabaseUrl,
  supabaseAnonKey,
  edgeBaseUrl,
  bookingBaseUrl,
  defaultTimezone
}
