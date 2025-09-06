import { createClient, SupabaseClient } from '@supabase/supabase-js';

function readEnv() {
  let metaEnv: any = {};
  try {
    metaEnv = (import.meta as any)?.env ?? {};
  } catch (e) {
    metaEnv = {};
  }
  const win = typeof window !== 'undefined' ? (window as any) : {};
  const proc = typeof process !== 'undefined' ? (process as any).env : {};

  const supabaseUrl = metaEnv.VITE_SUPABASE_URL ?? metaEnv.NEXT_PUBLIC_SUPABASE_URL ?? win.NEXT_PUBLIC_SUPABASE_URL ?? win.VITE_SUPABASE_URL ?? proc.VITE_SUPABASE_URL ?? proc.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY ?? metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? win.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? win.VITE_SUPABASE_ANON_KEY ?? proc.VITE_SUPABASE_ANON_KEY ?? proc.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return { supabaseUrl, supabaseAnonKey };
}

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_client) return _client;
  const { supabaseUrl, supabaseAnonKey } = readEnv();
  console.debug('[supabase:get] supabaseUrl present?', !!supabaseUrl, 'anon present?', !!supabaseAnonKey);
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    _client = createClient(supabaseUrl, supabaseAnonKey);
    console.debug('[supabase:get] client created');
    return _client;
  } catch (err) {
    console.error('[supabase:get] createClient error', err);
    return null;
  }
}

// Backwards-compatible proxy that throws clear error if not initialized
const handler: ProxyHandler<any> = {
  get(_, prop) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized. Ensure VITE_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL and corresponding anon key are set at build runtime.');
    const value = (client as any)[prop];
    if (typeof value === 'function') return value.bind(client);
    return value;
  },
  set(_, prop, value) {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client not initialized.');
    (client as any)[prop] = value;
    return true;
  },
};

export const supabase: SupabaseClient = new Proxy({}, handler) as unknown as SupabaseClient;
export default supabase;
