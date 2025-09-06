import { AppShell } from "@/components/app/AppShell";
import { Hero } from "@/components/app/Hero";
import { GlassCard } from "@/components/app/Primitives";
import { motion } from "framer-motion";
import { Sparkles, Share2, Workflow } from "lucide-react";

export default function Index() {
  const features = [
    { icon: Sparkles, title: "AI Prompts", text: "Describe it. We create the art." },
    { icon: Share2, title: "Multi-Chain", text: "Ethereum, Polygon, and Solana." },
    { icon: Workflow, title: "No-Code Workflows", text: "From prompt to mint in clicks." },
  ];
  return (
    <AppShell>
      <Hero />
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
              <GlassCard>
                <div className="flex items-start gap-4">
                  <f.icon className="h-6 w-6 text-white/70" />
                  <div>
                    <div className="font-semibold">{f.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{f.text}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
