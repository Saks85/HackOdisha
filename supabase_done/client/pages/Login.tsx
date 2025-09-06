import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Github } from "lucide-react";

export default function Login() {
  const { signIn, resetPassword, signInWithOAuth, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error.message || String(res.error));
    } else {
      navigate('/dashboard');
    }
  };

  const onForgot = async () => {
    const e = window.prompt('Enter your email for password reset');
    if (!e) return;
    const res = await resetPassword(e);
    if (res.error) alert('Error sending reset email: ' + res.error.message);
    else alert('Password reset email sent.');
  };

  return (
    <AppShell>
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md mx-auto">
          <Card className="glass">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
              {error && <div className="text-sm text-red-400">{error}</div>}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="button" disabled={loading || authLoading} onClick={async ()=>{
                    setError(null);
                    try {
                      setLoading(true);
                      const res = await signInWithOAuth('google');
                      setLoading(false);
                      if ((res as any)?.error) setError((res as any).error.message || 'OAuth error');
                    } catch (e: any) {
                      setLoading(false);
                      setError(e?.message || String(e));
                    }
                  }} className="w-full cta-pill grad-tealblue text-black flex items-center justify-center gap-2" aria-label="Continue with Google">
                    {/* Google icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M21.8 10.23h-9.8v3.54h5.6c-.24 1.44-1.61 4.22-5.6 4.22-3.37 0-6.12-2.78-6.12-6.2s2.75-6.2 6.12-6.2c1.92 0 3.2.82 3.94 1.53l2.7-2.6C17.04 3.04 14.88 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.76 0 9.88-4 9.88-9.73 0-.66-.07-1.2-.08-1.99z" fill="#4285F4"/>
                    </svg>
                    Continue with Google
                  </button>
                  <button type="button" disabled={loading || authLoading} onClick={async ()=>{
                    setError(null);
                    try {
                      setLoading(true);
                      const res = await signInWithOAuth('github');
                      setLoading(false);
                      if ((res as any)?.error) setError((res as any).error.message || 'OAuth error');
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

              <Input placeholder="Email" type="email" aria-label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <Input placeholder="Password" type="password" aria-label="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
              <div className="text-right text-sm text-muted-foreground"><button type="button" onClick={onForgot} className="hover:underline">Forgot password?</button></div>
              <Button type="submit" className="w-full cta-pill grad-purple text-black">{loading ? 'Logging in...' : 'Login'}</Button>
            </CardContent>
          </Card>
        </motion.form>
      </section>
    </AppShell>
  );
}
