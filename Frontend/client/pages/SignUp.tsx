import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

export default function SignUp() {
  return (
    <AppShell>
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md mx-auto">
          <Card className="glass">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
              <Input placeholder="Name" aria-label="Name" />
              <Input placeholder="Email" type="email" aria-label="Email" />
              <Input placeholder="Password" type="password" aria-label="Password" />
              <Input placeholder="Confirm Password" type="password" aria-label="Confirm Password" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox id="terms" /><label htmlFor="terms">I agree to the terms</label>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full grad-purple w-1/3" />
              </div>
              <Button className="w-full cta-pill grad-purple text-black">Sign Up</Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </AppShell>
  );
}
