import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Copy, Plus, Trash2, ShieldCheck, KeyRound } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [{ title: "Settings — UXray" }, { name: "description", content: "Workspace settings." }],
  }),
  component: Settings,
});

const team = [
  { name: "Sarah Chen", email: "sarah@uxray.app", role: "Owner", avatar: "SC" },
  { name: "Marcus Liu", email: "marcus@uxray.app", role: "Admin", avatar: "ML" },
  { name: "Priya Patel", email: "priya@uxray.app", role: "Member", avatar: "PP" },
  { name: "Jordan Reyes", email: "jordan@uxray.app", role: "Member", avatar: "JR" },
];

function Settings() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Manage your workspace, team, and security.
      </p>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="bg-card/60 p-1">
          {["profile", "team", "notifications", "api", "billing", "security"].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize text-xs">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-4">
          <Card className="p-6 bg-card/60">
            <h3 className="font-semibold">Profile</h3>
            <div className="mt-4 flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-aurora text-white text-lg">
                  SC
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Upload photo
              </Button>
            </div>
            <Separator className="my-6" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input defaultValue="Sarah Chen" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input defaultValue="sarah@uxray.app" type="email" />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input defaultValue="Head of Design" />
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Input defaultValue="America/Los_Angeles" />
              </div>
            </div>
            <Button className="mt-6 bg-gradient-primary text-primary-foreground border-0">
              Save changes
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card className="p-6 bg-card/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Team members</h3>
                <p className="text-xs text-muted-foreground">
                  {team.length} members in UXray Labs workspace
                </p>
              </div>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0">
                <Plus className="h-3.5 w-3.5 mr-1" /> Invite
              </Button>
            </div>
            <Separator className="my-4" />
            <ul className="space-y-2">
              {team.map((m) => (
                <li
                  key={m.email}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 transition"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-aurora text-white text-xs">
                      {m.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                  </div>
                  <Badge variant="outline">{m.role}</Badge>
                  {m.role !== "Owner" && (
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-4">
          <Card className="p-6 bg-card/60 space-y-4">
            <h3 className="font-semibold">Email notifications</h3>
            {[
              ["Audit completed", "Get notified when a new audit finishes"],
              ["Score regression", "Alert when overall score drops by >5 points"],
              ["New critical issue", "Critical accessibility issues detected"],
              ["Weekly digest", "Summary of all activity each Monday"],
            ].map(([t, d], i) => (
              <div key={t} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t}</div>
                  <div className="text-xs text-muted-foreground">{d}</div>
                </div>
                <Switch defaultChecked={i < 3} />
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6 space-y-4">
          <Card className="p-6 bg-card/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">API keys</h3>
                <p className="text-xs text-muted-foreground">
                  Programmatic access to your workspace
                </p>
              </div>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground border-0">
                <Plus className="h-3.5 w-3.5 mr-1" /> New key
              </Button>
            </div>
            <div className="space-y-2">
              {[
                { n: "Production", k: "uxr_live_••••••••••••••QX23", c: "Created 12 Jun 2026" },
                { n: "CI/CD", k: "uxr_live_••••••••••••••J9aZ", c: "Created 02 Apr 2026" },
              ].map((k) => (
                <div
                  key={k.n}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border"
                >
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{k.n}</div>
                    <div className="text-xs text-muted-foreground font-mono truncate">{k.k}</div>
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline">{k.c}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => toast.success("Copied")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-4">
          <Card className="p-6 bg-card/60">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-semibold">Pro plan</h3>
                <p className="text-xs text-muted-foreground">$49/user/mo · Renews Jul 26, 2026</p>
              </div>
              <Badge className="bg-gradient-primary text-primary-foreground border-0">Active</Badge>
            </div>
            <Separator className="my-4" />
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Audits this month</div>
                <div className="text-2xl font-bold mt-1">
                  412 <span className="text-xs text-muted-foreground">/ unlimited</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Team seats</div>
                <div className="text-2xl font-bold mt-1">
                  4 <span className="text-xs text-muted-foreground">/ 10</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Next invoice</div>
                <div className="text-2xl font-bold mt-1">$196</div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outline">Update payment</Button>
              <Button variant="outline">Download invoices</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-4">
          <Card className="p-6 bg-card/60">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-success/10 grid place-items-center">
                <ShieldCheck className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Two-factor authentication</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Adds an extra layer of security to your account.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
          <Card className="p-6 bg-card/60">
            <h3 className="font-semibold">Active sessions</h3>
            <ul className="mt-3 space-y-2">
              {[
                ["MacBook Pro · Chrome", "San Francisco, CA · Now"],
                ["iPhone 16 · Safari", "San Francisco, CA · 3h ago"],
              ].map(([d, c]) => (
                <li
                  key={d}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div>
                    <div className="text-sm font-medium">{d}</div>
                    <div className="text-xs text-muted-foreground">{c}</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
