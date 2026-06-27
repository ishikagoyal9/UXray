import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Monitor, Smartphone, Tablet, Sparkles, Loader2, Check, Globe } from "lucide-react";
import { personas } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/audits/new")({
  head: () => ({
    meta: [
      { title: "New audit — UXray" },
      { name: "description", content: "Start a new UX audit." },
    ],
  }),
  component: NewAudit,
});

const devices = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "mobile", label: "Mobile", icon: Smartphone },
] as const;

const stages = [
  "Crawling page",
  "Capturing snapshot",
  "Running WCAG checks",
  "Evaluating heuristics",
  "Simulating personas",
  "Generating report",
];

function NewAudit() {
  const nav = useNavigate();
  const [url, setUrl] = useState("https://acme.com/checkout");
  const [device, setDevice] = useState<string>("desktop");
  const [persona, setPersona] = useState<string>("professional");
  const [opts, setOpts] = useState({ wcag: true, heuristic: true, dom: true, perf: false });
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(0);

  function start() {
    setRunning(true);
    setStage(0);
    const interval = setInterval(() => {
      setStage((s) => {
        if (s >= stages.length - 1) {
          clearInterval(interval);
          setTimeout(() => nav({ to: "/app/audits/$id", params: { id: "aud_01" } }), 600);
          return s;
        }
        return s + 1;
      });
    }, 750);
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {!running ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Start a new audit</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Paste a URL, pick a persona, and we'll handle the rest.
            </p>

            <Card className="mt-6 p-6 bg-card/60 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <div className="relative">
                  <Globe className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-9 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Device</Label>
                <div className="grid grid-cols-3 gap-2">
                  {devices.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDevice(d.id)}
                      className={cn(
                        "rounded-xl border p-4 flex flex-col items-center gap-2 transition-all",
                        device === d.id
                          ? "border-primary bg-primary/5 shadow-glow"
                          : "border-border hover:border-border/80",
                      )}
                    >
                      <d.icon className="h-5 w-5" />
                      <span className="text-sm">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Persona</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={cn(
                        "rounded-xl border p-3 flex items-center gap-2 text-left transition-all",
                        persona === p.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80",
                      )}
                    >
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-xs font-medium leading-tight">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Audit options</Label>
                {[
                  ["wcag", "WCAG 2.2 compliance", "All A, AA, AAA criteria"],
                  ["heuristic", "Nielsen heuristics", "All 10 principles"],
                  ["dom", "DOM quality", "Semantic structure & depth"],
                  ["perf", "Performance budget", "Core Web Vitals (slower)"],
                ].map(([k, t, d]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                  >
                    <div>
                      <div className="text-sm font-medium">{t}</div>
                      <div className="text-xs text-muted-foreground">{d}</div>
                    </div>
                    <Switch
                      checked={opts[k as keyof typeof opts]}
                      onCheckedChange={(v) => setOpts({ ...opts, [k]: v })}
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={start}
                size="lg"
                className="w-full bg-gradient-primary text-primary-foreground border-0 shadow-glow"
              >
                <Sparkles className="h-4 w-4 mr-2" /> Run audit
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="relative mx-auto h-32 w-32">
              <div className="absolute inset-0 rounded-full bg-gradient-aurora opacity-30 blur-2xl animate-pulse-glow" />
              <div className="relative h-full w-full rounded-full glass border-border grid place-items-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            </div>
            <h2 className="mt-8 text-2xl font-semibold">Auditing {url.replace("https://", "")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">This usually takes 60–90 seconds.</p>
            <div className="mt-8 max-w-sm mx-auto space-y-2 text-left">
              {stages.map((s, i) => (
                <div key={s} className="flex items-center gap-3 text-sm">
                  {i < stage ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : i === stage ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-border" />
                  )}
                  <span className={i <= stage ? "" : "text-muted-foreground"}>{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
