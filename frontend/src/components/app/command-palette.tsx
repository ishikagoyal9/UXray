import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Accessibility,
  Settings,
  Plus,
  Sun,
  Moon,
  GitCompare,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
}) {
  const navigate = useNavigate();
  const { toggle } = useTheme();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/app/audits/new")}>
            <Plus className="h-4 w-4 mr-2" /> New audit
          </CommandItem>
          <CommandItem onSelect={() => go("/app/chat")}>
            <MessageSquare className="h-4 w-4 mr-2" /> Ask AI assistant
          </CommandItem>
          <CommandItem
            onSelect={() => {
              toggle();
              onOpenChange(false);
            }}
          >
            <Sun className="h-4 w-4 mr-2" /> Toggle theme{" "}
            <Moon className="h-3.5 w-3.5 ml-1 opacity-60" />
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/app/dashboard")}>
            <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/app/audits")}>
            <FileText className="h-4 w-4 mr-2" /> Audits
          </CommandItem>
          <CommandItem onSelect={() => go("/app/personas")}>
            <Users className="h-4 w-4 mr-2" /> Personas
          </CommandItem>
          <CommandItem onSelect={() => go("/app/accessibility")}>
            <Accessibility className="h-4 w-4 mr-2" /> Accessibility
          </CommandItem>
          <CommandItem onSelect={() => go("/app/compare")}>
            <GitCompare className="h-4 w-4 mr-2" /> Before / After
          </CommandItem>
          <CommandItem onSelect={() => go("/app/settings")}>
            <Settings className="h-4 w-4 mr-2" /> Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
