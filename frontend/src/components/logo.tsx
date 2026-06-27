import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-aurora shadow-glow">
        <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
      </span>
      {withText && <span className="text-lg tracking-tight">UXray</span>}
    </Link>
  );
}
