import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Plus,
  TrendingUp,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  audits,
  scoreTrend,
  issueDistribution,
  severityDistribution,
  activityFeed,
} from "@/lib/mock-data";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — UXray" },
      { name: "description", content: "Your UX & accessibility command center." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "UX Score", value: 87, delta: "+4", color: "from-violet-500 to-fuchsia-500" },
  { label: "WCAG", value: 92, delta: "+2", color: "from-blue-500 to-cyan-500" },
  { label: "Heuristic", value: 81, delta: "+6", color: "from-emerald-500 to-teal-500" },
  { label: "DOM", value: 89, delta: "+1", color: "from-amber-500 to-orange-500" },
];

const issueStats = [
  { label: "Issues Found", value: 155, icon: AlertTriangle, color: "text-foreground" },
  { label: "Critical", value: 13, icon: AlertTriangle, color: "text-destructive" },
  { label: "Medium", value: 45, icon: Activity, color: "text-warning" },
  { label: "Low", value: 97, icon: CheckCircle2, color: "text-info" },
];

function Dashboard() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, Sarah</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your UX has improved 12% this week. Here's what changed.
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"
        >
          <Link to="/app/audits/new">
            <Plus className="h-4 w-4 mr-1" /> New audit
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-5 bg-card border-border/60 relative overflow-hidden">
              <div
                className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-xl`}
              />
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <div
                  className={`text-4xl font-bold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}
                >
                  {s.value}
                </div>
                <Badge variant="outline" className="text-[10px] text-success border-success/40">
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                  {s.delta}
                </Badge>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${s.color}`}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {issueStats.map((s) => (
          <Card key={s.label} className="p-4 bg-card/60 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg bg-muted grid place-items-center ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-xl font-semibold">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bg-card/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Score trend</h3>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={scoreTrend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[60, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Area
                type="monotone"
                dataKey="overall"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#g1)"
              />
              <Area
                type="monotone"
                dataKey="wcag"
                stroke="var(--chart-2)"
                strokeWidth={2}
                fill="url(#g2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 bg-card/60">
          <h3 className="font-semibold mb-1">Issue distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">By category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={issueDistribution}
                dataKey="value"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
              >
                {issueDistribution.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1.5">
            {issueDistribution.map((e) => (
              <li key={e.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: e.color }} /> {e.name}
                </span>
                <span className="text-muted-foreground">{e.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bg-card/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent audits</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/audits">
                View all <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left font-medium px-2 py-2">Site</th>
                  <th className="text-left font-medium px-2 py-2 hidden sm:table-cell">Persona</th>
                  <th className="text-left font-medium px-2 py-2">Score</th>
                  <th className="text-left font-medium px-2 py-2 hidden md:table-cell">Issues</th>
                  <th className="text-left font-medium px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {audits.slice(0, 5).map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-border/40 hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-2 py-3">
                      <Link
                        to="/app/audits/$id"
                        params={{ id: a.id }}
                        className="font-medium text-sm hover:underline"
                      >
                        {a.domain}
                      </Link>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {a.url}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                      {a.persona}
                    </td>
                    <td className="px-2 py-3">
                      <ScoreBadge value={a.scores.overall} status={a.status} />
                    </td>
                    <td className="px-2 py-3 text-xs hidden md:table-cell">
                      <span className="text-destructive">{a.issues.critical}</span> /{" "}
                      <span className="text-warning">{a.issues.medium}</span> /{" "}
                      <span className="text-info">{a.issues.low}</span>
                    </td>
                    <td className="px-2 py-3">
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/app/audits/$id" params={{ id: a.id }}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5 bg-card/60">
          <h3 className="font-semibold mb-4">Activity</h3>
          <ol className="space-y-4 relative">
            <span className="absolute left-3.5 top-2 bottom-2 w-px bg-border" />
            {activityFeed.map((a) => (
              <li key={a.id} className="relative flex gap-3 pl-9">
                <div className="absolute left-0 top-0 h-7 w-7 rounded-full bg-card border border-border grid place-items-center">
                  {a.type === "audit_completed" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  ) : a.type === "audit_started" ? (
                    <Clock className="h-3.5 w-3.5 text-info" />
                  ) : (
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-sm">
                    <span className="font-medium">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.type.replace("_", " ")}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{a.target}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{a.time}</div>
                </div>
                {a.score && (
                  <Badge variant="outline" className="text-xs h-fit">
                    {a.score}
                  </Badge>
                )}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

function ScoreBadge({ value, status }: { value: number; status: string }) {
  if (status === "running")
    return (
      <Badge variant="outline" className="text-info border-info/40">
        <Clock className="h-3 w-3 mr-1 animate-spin" /> Running
      </Badge>
    );
  if (status === "failed")
    return (
      <Badge variant="outline" className="text-destructive border-destructive/40">
        Failed
      </Badge>
    );
  const color = value >= 90 ? "text-success" : value >= 75 ? "text-warning" : "text-destructive";
  return <span className={`text-lg font-semibold ${color}`}>{value}</span>;
}
