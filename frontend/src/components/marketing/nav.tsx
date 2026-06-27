import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Product" },
  { to: "/pricing", label: "Pricing" },
  { to: "/app/dashboard", label: "Dashboard" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-3 max-w-6xl px-4">
        <div className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-elegant">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-1">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90"
            >
              <Link to="/auth/sign-up">Get started</Link>
            </Button>
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden glass rounded-2xl mt-2 p-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md hover:bg-accent text-sm"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/auth/sign-in">Sign in</Link>
              </Button>
              <Button
                asChild
                className="flex-1 bg-gradient-primary text-primary-foreground border-0"
              >
                <Link to="/auth/sign-up">Get started</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
