import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { Github } from "lucide-react";
import AppShell from "@/components/app/AppShell";

export default function SignUp() {
  const { signUp, signInWithOAuth, loading: authLoading, error: authError, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [debug, setDebug] = useState({
    metaUrl: false,
    metaKey: false,
    windowUrl: false,
    windowKey: false,
    procUrl: false,
    procKey: false,
    clientCreated: false,
    envDump: '' as string,
  });

  useEffect(() => {
    const meta: any = (import.meta as any)?.env ?? {};
    const win: any = typeof window !== "undefined" ? (window as any) : {};
    const proc: any = typeof process !== "undefined" ? (process as any).env : {};

    const metaUrl = !!(meta.NEXT_PUBLIC_SUPABASE_URL ?? meta.VITE_SUPABASE_URL);
    const metaKey = !!(meta.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? meta.VITE_SUPABASE_ANON_KEY);
    const windowUrl = !!(win.NEXT_PUBLIC_SUPABASE_URL ?? win.VITE_SUPABASE_URL);
    const windowKey = !!(win.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? win.VITE_SUPABASE_ANON_KEY);
    const procUrl = !!(proc.NEXT_PUBLIC_SUPABASE_URL ?? proc.VITE_SUPABASE_URL);
    const procKey = !!(proc.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? proc.VITE_SUPABASE_ANON_KEY);

    let clientCreated = false;
    try {
      const client = getSupabaseClient();
      clientCreated = !!client;
    } catch (e) {
      clientCreated = false;
    }

    let envDump = '';
    try {
      envDump = JSON.stringify(meta, Object.keys(meta).sort(), 2);
    } catch (e) {
      envDump = String(meta);
    }

    setDebug({ metaUrl, metaKey, windowUrl, windowKey, procUrl, procKey, clientCreated, envDump });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    clearError();
    if (!name || !email || !password) return setError('Please fill all fields');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    const res = await signUp(name, email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error.message || String(res.error));
    } else {
      alert('Check your email to confirm your account.');
    }
  };

  return (
    <AppShell>
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md mx-auto">
          <Card className="glass">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
              {(error || authError) && (
                <div className="text-sm text-red-400">
                  {error || authError?.message}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="button" disabled={loading || authLoading} onClick={async () => {
                    setError(null);
                    clearError();
                    try {
                      setLoading(true);
                      const res = await signInWithOAuth('google');
                      setLoading(false);
                      if (res?.error) setError(res.error.message || 'OAuth error');
                    } catch (e: any) {
                      setLoading(false);
                      setError(e?.message || String(e));
                    }
                  }} className="w-full cta-pill grad-tealblue text-black flex items-center justify-center gap-2" aria-label="Continue with Google">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M21.8 10.23h-9.8v3.54h5.6c-.24 1.44-1.61 4.22-5.6 4.22-3.37 0-6.12-2.78-6.12-6.2s2.75-6.2 6.12-6.2c1.92 0 3.2.82 3.94 1.53l2.7-2.6C17.04 3.04 14.88 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.76 0 9.88-4 9.88-9.73 0-.66-.07-1.2-.08-1.99z" fill="#4285F4"/>
                    </svg>
                    Continue with Google
                  </button>
                  <button type="button" disabled={loading || authLoading} onClick={async () => {
                    setError(null);
                    clearError();
                    try {
                      setLoading(true);
                      const res = await signInWithOAuth('github');
                      setLoading(false);
                      if (res?.error) setError(res.error.message || 'OAuth error');
                    } catch (e: any) {
                      setLoading(false);
                      setError(e?.message || String(e));
                    }
                  }} className="w-full cta-pill grad-purple text-black flex items-center justify-center gap-2" aria-label="Continue with GitHub">
                    <Github className="w-4 h-4" />
                    Continue with GitHub
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/5" />
                  <div className="text-sm text-muted-foreground">or</div>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
              </div>

              <Input placeholder="Name" aria-label="Name" value={name} onChange={(e)=>setName(e.target.value)} />
              <Input placeholder="Email" type="email" aria-label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <Input placeholder="Password" type="password" aria-label="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
              <Input placeholder="Confirm Password" type="password" aria-label="Confirm Password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox id="terms" /><label htmlFor="terms">I agree to the terms</label>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full grad-purple w-1/3" />
              </div>
              <Button type="submit" disabled={loading} className="w-full cta-pill grad-purple text-black">{loading ? 'Signing up...' : 'Sign Up'}</Button>

              {/* Debug Panel */}
              <div className="mt-4 p-3 rounded-md bg-white/3 border border-white/5 text-sm">
                <div className="font-medium mb-2">Debug</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between"><span>import.meta URL</span><span>{String(debug.metaUrl)}</span></div>
                  <div className="flex justify-between"><span>import.meta KEY</span><span>{String(debug.metaKey)}</span></div>
                  <div className="flex justify-between"><span>window URL</span><span>{String(debug.windowUrl)}</span></div>
                  <div className="flex justify-between"><span>window KEY</span><span>{String(debug.windowKey)}</span></div>
                  <div className="flex justify-between"><span>process URL</span><span>{String(debug.procUrl)}</span></div>
                  <div className="flex justify-between"><span>process KEY</span><span>{String(debug.procKey)}</span></div>
                  <div className="flex justify-between col-span-2 pt-2 border-t border-white/5"><span>Supabase client created</span><span>{String(debug.clientCreated)}</span></div>
                  <div className="col-span-2 pt-2">
                    <div className="text-xs text-muted-foreground mb-1">import.meta.env dump (partial)</div>
                    <pre className="text-xs bg-black/20 p-2 rounded max-h-48 overflow-auto">{debug.envDump}</pre>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </motion.form>
      </section>
    </AppShell>
  );
}
