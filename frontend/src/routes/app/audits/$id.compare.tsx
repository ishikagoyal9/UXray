import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { audits } from "@/lib/mock-data";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/app/audits/$id/compare")({
  head: () => ({
    meta: [
      { title: "Before / After — UXray" },
      { name: "description", content: "Compare original and fixed previews." },
    ],
  }),
  component: Compare,
});

function Compare() {
  const { id } = Route.useParams();
  const audit = audits.find((a) => a.id === id) ?? audits[0]!;
  const [split, setSplit] = useState(50);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 flex-wrap">
        <Button asChild variant="ghost" size="icon">
          <Link to="/app/audits/$id" params={{ id }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Before / After</h1>
          <p className="text-xs text-muted-foreground">
            {audit.domain} · Applying 18 recommended fixes
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Original score</div>
          <div className="text-3xl font-bold mt-1 text-destructive">{audit.scores.overall}</div>
        </Card>
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Projected score</div>
          <div className="text-3xl font-bold mt-1 text-success">
            {Math.min(100, audit.scores.overall + 14)}
          </div>
        </Card>
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Improvement</div>
          <div className="text-3xl font-bold mt-1 gradient-text">+14</div>
        </Card>
      </div>

      <Card className="p-4 bg-card/60">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium">Visual diff</div>
          <div className="flex gap-1.5">
            <Badge variant="outline" className="text-destructive border-destructive/40">
              Original
            </Badge>
            <Badge variant="outline" className="text-success border-success/40">
              Fixed
            </Badge>
          </div>
        </div>
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-border select-none">
          <MockPreview variant="after" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${split}%` }}>
            <div className="w-[100vw]" style={{ width: `${10000 / split}%` }}>
              <MockPreview variant="before" />
            </div>
          </div>
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-glow"
            style={{ left: `${split}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white grid place-items-center shadow-elegant cursor-ew-resize">
              <ArrowLeft className="h-3 w-3 text-foreground" />
              <ArrowRight className="h-3 w-3 text-foreground -ml-1" />
            </div>
          </div>
        </div>
        <div className="mt-4 px-2">
          <Slider
            value={[split]}
            onValueChange={(v) => setSplit(v[0]!)}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </Card>

      <Card className="p-5 bg-card/60">
        <h3 className="font-semibold text-sm mb-3">Highlighted differences</h3>
        <ul className="space-y-2 text-sm">
          {[
            "Primary CTA contrast: 3.2:1 → 8.1:1",
            "Focus indicator added to all interactive elements",
            "Hero image alt text rewritten",
            "Heading hierarchy normalized (h1 → h2 → h3)",
            "Touch targets enlarged to 44×44px minimum",
          ].map((d, i) => (
            <li
              key={i}
              className="flex items-start gap-2 p-2 rounded bg-success/5 border border-success/20"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success mt-2" /> {d}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function MockPreview({ variant }: { variant: "before" | "after" }) {
  const isBefore = variant === "before";
  return (
    <div className={`absolute inset-0 ${isBefore ? "bg-zinc-50" : "bg-white"}`}>
      <div className="p-6 h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className={`h-6 w-24 rounded ${isBefore ? "bg-zinc-300" : "bg-zinc-900"}`} />
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded bg-zinc-200" />
            <div className="h-5 w-16 rounded bg-zinc-200" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className={`h-8 w-3/4 rounded ${isBefore ? "bg-zinc-300" : "bg-zinc-900"}`} />
          <div className="h-3 w-1/2 rounded bg-zinc-300" />
          <div className="h-3 w-2/5 rounded bg-zinc-300" />
          <button
            className={`mt-2 px-6 py-2.5 rounded-md text-sm font-medium ${isBefore ? "bg-violet-300 text-white" : "bg-violet-700 text-white shadow-md"}`}
          >
            Checkout
          </button>
        </div>
        <div
          className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold ${isBefore ? "bg-destructive text-white" : "bg-success text-white"}`}
        >
          {isBefore ? "BEFORE" : "AFTER"}
        </div>
      </div>
    </div>
  );
}
