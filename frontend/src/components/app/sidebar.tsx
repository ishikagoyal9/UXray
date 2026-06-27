import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  Users,
  Accessibility,
  Settings,
  Plus,
  GitCompare,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/audits", label: "Audits", icon: FileText },
  { to: "/app/chat", label: "AI Assistant", icon: MessageSquare },
  { to: "/app/personas", label: "Personas", icon: Users },
  { to: "/app/accessibility", label: "Accessibility", icon: Accessibility },
  { to: "/app/compare", label: "Before / After", icon: GitCompare },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="p-4">
        <Logo />
      </div>
      <div className="px-3 pb-2">
        <Button
          asChild
          className="w-full justify-start gap-2 bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90"
        >
          <Link to="/app/audits/new" onClick={onNavigate}>
            <Plus className="h-4 w-4" /> New audit
          </Link>
        </Button>
      </div>
      <div className="px-3 mt-2">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-sidebar-border bg-background/40 text-muted-foreground hover:text-foreground transition">
          <Search className="h-4 w-4" /> <span className="flex-1 text-left">Search…</span>
          <kbd className="hidden md:inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            ⌘K
          </kbd>
        </button>
      </div>
      <nav className="flex-1 mt-4 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-gradient-aurora" />
              )}
              <Icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <div className="glass rounded-xl p-3">
          <div className="text-xs font-medium">Free trial</div>
          <div className="text-xs text-muted-foreground mt-1">8 audits remaining</div>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-aurora w-2/3" />
          </div>
          <Button asChild size="sm" variant="outline" className="w-full mt-3 text-xs">
            <Link to="/pricing">Upgrade</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
