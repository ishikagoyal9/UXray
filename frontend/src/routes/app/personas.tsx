import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { personas } from "@/lib/mock-data";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/personas")({
  head: () => ({
    meta: [
      { title: "Personas — UXray" },
      { name: "description", content: "Persona-based UX auditing." },
    ],
  }),
  component: Personas,
});

const radarData = [
  {
    area: "Perceivable",
    student: 88,
    senior: 62,
    professional: 92,
    lowVision: 55,
    colorBlind: 70,
    screenReader: 48,
  },
  {
    area: "Operable",
    student: 90,
    senior: 70,
    professional: 90,
    lowVision: 60,
    colorBlind: 80,
    screenReader: 55,
  },
  {
    area: "Understandable",
    student: 85,
    senior: 65,
    professional: 88,
    lowVision: 65,
    colorBlind: 78,
    screenReader: 60,
  },
  {
    area: "Robust",
    student: 80,
    senior: 55,
    professional: 85,
    lowVision: 50,
    colorBlind: 72,
    screenReader: 45,
  },
];

function Personas() {
  const [active, setActive] = useState(personas[2]!.id);
  const sel = personas.find((p) => p.id === active) ?? personas[0]!;
  const keyMap: Record<string, string> = {
    student: "student",
    senior: "senior",
    professional: "professional",
    "low-vision": "lowVision",
    "color-blind": "colorBlind",
    "screen-reader": "screenReader",
  };
  const key = keyMap[active] ?? "professional";

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Persona Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">
          See how UX shifts for different user groups.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {personas.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button onClick={() => setActive(p.id)} className="text-left w-full">
              <Card
                className={cn(
                  "p-5 transition-all h-full",
                  active === p.id
                    ? "border-primary/60 shadow-glow bg-card"
                    : "bg-card/60 hover:border-border",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{p.icon}</div>
                  <Badge variant="outline" className="text-xs">
                    Score {p.impactScore}
                  </Badge>
                </div>
                <h3 className="mt-4 font-semibold">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{p.criticalIssues} critical issues</span>
                  <span className="text-foreground font-medium">{p.impactScore}/100</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.impactScore}%`, background: p.color }}
                  />
                </div>
              </Card>
            </button>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6 bg-card/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{sel.icon}</div>
            <div>
              <h3 className="font-semibold">{sel.name}</h3>
              <p className="text-xs text-muted-foreground">{sel.desc}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="area"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <PolarRadiusAxis stroke="var(--border)" tick={false} domain={[0, 100]} />
              <Radar
                dataKey={key}
                stroke={sel.color}
                fill={sel.color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6 bg-card/60">
          <h3 className="font-semibold mb-4">Top issues for {sel.name.toLowerCase()}</h3>
          <ul className="space-y-3">
            {[
              { sev: "critical", t: "Text below 16px is unreadable at default zoom", impact: 38 },
              { sev: "critical", t: "Color-only error states fail without indicators", impact: 24 },
              { sev: "medium", t: "Modal close action requires precise tap target", impact: 18 },
              { sev: "medium", t: "Animation cannot be paused or disabled", impact: 12 },
              { sev: "low", t: "Inconsistent button labeling across flows", impact: 8 },
            ].map((it, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border"
              >
                <span
                  className={cn(
                    "mt-1 h-2 w-2 rounded-full shrink-0",
                    it.sev === "critical"
                      ? "bg-destructive"
                      : it.sev === "medium"
                        ? "bg-warning"
                        : "bg-info",
                  )}
                />
                <div className="flex-1">
                  <div className="text-sm">{it.t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Affects {it.impact}% of {sel.name.toLowerCase()} traffic
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full mt-4">
            Run full {sel.name} audit
          </Button>
        </Card>
      </div>
    </div>
  );
}
