import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { accessibilityChecks, wcagPrinciples } from "@/lib/mock-data";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Check, X, Eye, Keyboard, Volume2, FileText } from "lucide-react";

export const Route = createFileRoute("/app/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility — UXray" },
      { name: "description", content: "WCAG compliance dashboard." },
    ],
  }),
  component: A11y,
});

function A11y() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Accessibility Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          WCAG 2.2 compliance status across all monitored pages.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wcagPrinciples.map((p) => (
          <Card key={p.name} className="p-5 bg-card/60">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-xl grid place-items-center text-white font-bold"
                style={{
                  background: `linear-gradient(135deg, ${p.color}, color-mix(in oklab, ${p.color} 70%, white))`,
                }}
              >
                {p.letter}
              </div>
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  {82 + Math.floor(Math.random() * 12)}% pass
                </div>
              </div>
            </div>
            <Progress value={82 + Math.floor(Math.random() * 12)} className="mt-3" />
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 bg-card/60">
          <h3 className="font-semibold mb-4">Check pass-rate</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={accessibilityChecks} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                stroke="var(--muted-foreground)"
                fontSize={11}
                domain={[0, 100]}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="var(--muted-foreground)"
                fontSize={11}
                width={110}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="score" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 bg-card/60">
          <h3 className="font-semibold mb-4">Audit categories</h3>
          <ul className="space-y-3">
            {[
              { icon: Eye, label: "Color contrast", pass: true },
              { icon: FileText, label: "Alt text coverage", pass: true },
              { icon: Keyboard, label: "Keyboard navigation", pass: true },
              { icon: Volume2, label: "Screen reader", pass: false },
              { icon: FileText, label: "Form accessibility", pass: true },
            ].map((c) => (
              <li key={c.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                <c.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm flex-1">{c.label}</span>
                {c.pass ? (
                  <Badge variant="outline" className="text-success border-success/40">
                    <Check className="h-3 w-3 mr-1" />
                    Pass
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-destructive border-destructive/40">
                    <X className="h-3 w-3 mr-1" />9 issues
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 bg-card/60">
        <h3 className="font-semibold mb-4">Detailed check results</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left p-3 font-medium">Check</th>
                <th className="text-left p-3 font-medium">Passed</th>
                <th className="text-left p-3 font-medium">Failed</th>
                <th className="text-left p-3 font-medium">Score</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {accessibilityChecks.map((c) => (
                <tr key={c.name} className="border-b border-border/40 last:border-0">
                  <td className="p-3 text-sm font-medium">{c.name}</td>
                  <td className="p-3 text-sm text-success">{c.passed}</td>
                  <td className="p-3 text-sm text-destructive">{c.failed}</td>
                  <td className="p-3 text-sm">{c.score}</td>
                  <td className="p-3">
                    <Badge
                      variant="outline"
                      className={
                        c.score >= 90
                          ? "text-success border-success/40"
                          : "text-warning border-warning/40"
                      }
                    >
                      {c.score >= 90 ? "Compliant" : "Needs work"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
