import { Button, ButtonProps } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-gradient bg-[linear-gradient(135deg,#6E56CF,#9D8DF1)]", className)}>
      {children}
    </span>
  );
}

export function CTAButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "cta-pill grad-purple text-black hover:opacity-95 hover-glow",
        className,
      )}
    />
  );
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card className={cn("glass rounded-2xl", className)}>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}

export function GlassyPillFilter({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-full text-sm border",
        active ? "border-white/30 bg-white/10" : "border-white/10 bg-white/5",
      )}
    >
      {label}
    </div>
  );
}
