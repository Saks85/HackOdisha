import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
  const [dark] = useState(true);
  return (
    <Button variant="ghost" size="icon" aria-label="Theme toggle" className="glass">
      {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}
