import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient as _getSupabaseClient } from "./supabaseClient";

export function getSupabaseClient(): SupabaseClient | null {
  return _getSupabaseClient();
}

// Backwards-compatible proxy that throws clear error if not initialized
const handler: ProxyHandler<any> = {
  get(_, prop) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error(
        "Supabase client not initialized. Check console for errors.",
      );
    }
    const value = (client as any)[prop];
    if (typeof value === "function") return value.bind(client);
    return value;
  },
  set(_, prop, value) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Supabase client not initialized.");
    }
    (client as any)[prop] = value;
    return true;
  },
};

export const supabase: SupabaseClient = new Proxy(
  {},
  handler,
) as unknown as SupabaseClient;
export default supabase;
