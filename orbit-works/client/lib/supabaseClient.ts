import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Hardcoded Supabase credentials for immediate functionality
const SUPABASE_URL = "https://rwrlkizujmfmrgwszvfu.supabase.co/";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cmxraXp1am1mbXJnd3N6dmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTQ3MDksImV4cCI6MjA3MjczMDcwOX0.1e_9ZzEahD-3b52HeaVLGuzc62m2OZazqPKwA0RI1Wc";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_client) return _client;

  try {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
    console.log(
      "[supabaseClient] ✅ Client created successfully with hardcoded credentials",
    );
    return _client;
  } catch (err) {
    console.error("[supabaseClient] ❌ Failed to create Supabase client:", err);
    return null;
  }
}

export const supabaseClient = getSupabaseClient();
export default supabaseClient;
