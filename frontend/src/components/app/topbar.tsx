import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";

export function AppTopbar({ onMenu, onSearch }: { onMenu?: () => void; onSearch?: () => void }) {
  return (
    <header className="h-14 flex items-center gap-2 border-b border-border/60 bg-background/60 backdrop-blur-xl px-4 sticky top-0 z-30">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="menu">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
      <Button
        variant="outline"
        size="sm"
        onClick={onSearch}
        className="hidden sm:inline-flex gap-2 text-muted-foreground"
      >
        <span className="text-xs">Quick actions</span>
        <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border">⌘K</kbd>
      </Button>
      <ThemeToggle />
      <Button variant="ghost" size="icon" className="relative" aria-label="notifications">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full p-0.5 hover:bg-accent transition">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                SC
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="font-medium">Sarah Chen</div>
            <div className="text-xs text-muted-foreground font-normal">sarah@uxray.app</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/app/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/pricing">Billing</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/">Sign out</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
