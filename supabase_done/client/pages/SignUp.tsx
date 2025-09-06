import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";

export default function SignUp() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
              {error && <div className="text-sm text-red-400">{error}</div>}
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
            </CardContent>
          </Card>
        </motion.form>
      </section>
    </AppShell>
  );
}
