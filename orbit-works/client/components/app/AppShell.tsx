import React, { ReactNode } from 'react';
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10 bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl grad-purple" />
            <span className="font-bold tracking-tight text-lg">NFTForge</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <NavItem to="/create">Create</NavItem>
            <NavItem to="/mint">Mint</NavItem>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/settings">Settings</NavItem>
          </nav>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link to="/login">
              <Button variant="ghost" className="glass">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="cta-pill grad-purple text-black hover:opacity-90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10 bg-background/60 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} NFTForge</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <a href="https://builder.io" target="_blank" className="hover:underline" rel="noreferrer">Builder.io</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "transition-colors hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground",
        )
      }
    >
      {children}
    </NavLink>
  );
}

export default AppShell;
