import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, Search, ExternalLink, GitCompare } from "lucide-react";
import { audits, issues } from "@/lib/mock-data";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/audits/$id/")({
  head: ({ params }) => ({
    meta: [
      { title: `Audit ${params.id} — UXray` },
      { name: "description", content: "Detailed audit results." },
    ],
  }),
  component: AuditDetail,
});

function AuditDetail() {
  const { id } = Route.useParams();
  const audit = audits.find((a) => a.id === id) ?? audits[0]!;

  const [sev, setSev] = useState<"all" | "critical" | "medium" | "low">("all");
  const [q, setQ] = useState("");
  const filtered = issues.filter(
    (i) =>
      (sev === "all" || i.severity === sev) &&
      (q === "" || i.title.toLowerCase().includes(q.toLowerCase())),
  );
  const radial = [{ name: "score", value: audit.scores.overall, fill: "url(#gradScore)" }];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon">
            <Link to="/app/audits">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold truncate">{audit.domain}</h1>
            <a
              href={audit.url}
              className="text-xs text-muted-foreground hover:underline flex items-center gap-1 truncate"
            >
              <ExternalLink className="h-3 w-3" />
              {audit.url}
            </a>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/app/audits/$id/compare" params={{ id }}>
              <GitCompare className="h-3.5 w-3.5 mr-1" /> Before / After
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1" /> Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-3.5 w-3.5 mr-1" /> Share
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1 p-6 bg-card/60 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-aurora opacity-10 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Overall score</p>
            <div className="mt-3 h-44 relative">
              <ResponsiveContainer>
                <RadialBarChart
                  data={radial}
                  startAngle={90}
                  endAngle={90 - (360 * audit.scores.overall) / 100}
                  innerRadius="75%"
                  outerRadius="100%"
                >
                  <defs>
                    <linearGradient id="gradScore" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" />
                      <stop offset="100%" stopColor="var(--chart-2)" />
                    </linearGradient>
                  </defs>
                  <RadialBar
                    background={{ fill: "var(--muted)" }}
                    dataKey="value"
                    cornerRadius={20}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center">
                <div>
                  <div className="text-5xl font-bold gradient-text">{audit.scores.overall}</div>
                  <div className="text-xs text-muted-foreground">out of 100</div>
                </div>
              </div>
            </div>
            <Badge className="mt-2 bg-success/10 text-success border-success/30">
              WCAG AA passing
            </Badge>
          </div>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: "WCAG", value: audit.scores.wcag, color: "from-blue-500 to-cyan-500" },
            {
              label: "Heuristic",
              value: audit.scores.heuristic,
              color: "from-emerald-500 to-teal-500",
            },
            { label: "DOM", value: audit.scores.dom, color: "from-amber-500 to-orange-500" },
          ].map((s) => (
            <Card key={s.label} className="p-5 bg-card/60">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div
                className={`mt-2 text-4xl font-bold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}
              >
                {s.value}
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${s.color}`}
                />
              </div>
            </Card>
          ))}
          <Card className="col-span-3 p-5 bg-card/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Issue summary</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Critical",
                  val: audit.issues.critical,
                  color: "bg-destructive",
                  text: "text-destructive",
                },
                {
                  label: "Medium",
                  val: audit.issues.medium,
                  color: "bg-warning",
                  text: "text-warning",
                },
                { label: "Low", val: audit.issues.low, color: "bg-info", text: "text-info" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${s.color}`} />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <div className={`mt-1 text-2xl font-bold ${s.text}`}>{s.val}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5 bg-card/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold">Issues ({filtered.length})</h3>
            <p className="text-xs text-muted-foreground">Sorted by severity then impact</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-md border border-border bg-background/40 p-0.5">
              {(["all", "critical", "medium", "low"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSev(s)}
                  className={cn(
                    "px-3 py-1 text-xs rounded capitalize transition",
                    sev === s
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search issues…"
                className="pl-8 h-9 w-48"
              />
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {filtered.map((issue) => (
            <Link
              key={issue.id}
              to="/app/audits/$id/issues/$issueId"
              params={{ id, issueId: issue.id }}
              className="block rounded-xl border border-border p-4 hover:border-primary/40 hover:bg-accent/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <SeverityDot sev={issue.severity} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">{issue.title}</span>
                    <Badge variant="outline" className="text-[10px] h-5">
                      {issue.category}
                    </Badge>
                    {issue.wcagRef && (
                      <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground">
                        {issue.wcagRef}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {issue.description}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
                  Impact: <span className="text-foreground">{issue.impact}</span>
                </div>
              </div>
            </Link>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SeverityDot({ sev }: { sev: string }) {
  const color = sev === "critical" ? "bg-destructive" : sev === "medium" ? "bg-warning" : "bg-info";
  return (
    <span
      className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${color} ring-4 ring-${sev === "critical" ? "destructive" : sev === "medium" ? "warning" : "info"}/15`}
    />
  );
}
