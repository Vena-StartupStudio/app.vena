// application-page/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// (optional) quick sanity log — remove later
console.log(
  '[supabase env]',
  (supabaseUrl || '').replace(/(https:\/\/)(.*?)(\.supabase\.co)/, '$1***$3'),
  (supabaseAnonKey || '').slice(0, 8) + '…'
);
