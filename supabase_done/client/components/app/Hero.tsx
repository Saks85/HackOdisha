import { motion } from "framer-motion";
import { CTAButton, GradientText } from "./Primitives";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 aurora animate-aurora" />
      <div className="absolute inset-0 noise pointer-events-none" />
      <div className="container max-w-7xl mx-auto px-4 py-24 md:py-32 text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Create. Mint. Own. <GradientText>No Code.</GradientText>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          AI-powered NFT builder with multi-chain support.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link to="/signup"><CTAButton>Get Started</CTAButton></Link>
          <Link to="/login">
            <Button variant="ghost" className="cta-pill glass text-foreground">Login</Button>
          </Link>
        </motion.div>

        <div className="mt-12 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="glass px-3 py-1 rounded-full">Ethereum</span>
          <span className="glass px-3 py-1 rounded-full">Polygon</span>
          <span className="glass px-3 py-1 rounded-full">Solana</span>
        </div>
      </div>
    </section>
  );
}
