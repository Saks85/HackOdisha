import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <AppShell>
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md mx-auto">
          <Card className="glass">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
              <Input placeholder="Email" type="email" aria-label="Email" />
              <Input placeholder="Password" type="password" aria-label="Password" />
              <div className="text-right text-sm text-muted-foreground"><Link to="#" className="hover:underline">Forgot password?</Link></div>
              <Button className="w-full cta-pill grad-purple text-black">Login</Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </AppShell>
  );
}
