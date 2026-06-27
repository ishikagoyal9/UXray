import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { audits } from "@/lib/mock-data";
import { ArrowRight, GitCompare } from "lucide-react";

export const Route = createFileRoute("/app/compare")({
  head: () => ({
    meta: [
      { title: "Before / After — UXray" },
      { name: "description", content: "Pick an audit to compare." },
    ],
  }),
  component: ComparePicker,
});

function ComparePicker() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-aurora grid place-items-center">
          <GitCompare className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Before / After</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pick an audit to visualize proposed fixes.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {audits
          .filter((a) => a.status === "completed")
          .map((a) => (
            <Card key={a.id} className="p-5 bg-card/60 hover:border-primary/40 transition group">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{a.domain}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.url}</div>
                </div>
                <div className="text-2xl font-bold gradient-text">{a.scores.overall}</div>
              </div>
              <Button
                asChild
                className="w-full mt-4 bg-gradient-primary text-primary-foreground border-0"
              >
                <Link to="/app/audits/$id/compare" params={{ id: a.id }}>
                  Open comparison <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </Card>
          ))}
      </div>
    </div>
  );
}
