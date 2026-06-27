import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Lightbulb,
  Code2,
  Image as ImageIcon,
  TrendingUp,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { issues } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/audits/$id/issues/$issueId")({
  head: ({ params }) => ({
    meta: [
      { title: `Issue ${params.issueId} — UXray` },
      { name: "description", content: "Issue details." },
    ],
  }),
  component: IssueDetail,
});

function IssueDetail() {
  const { id, issueId } = Route.useParams();
  const issue = issues.find((i) => i.id === issueId) ?? issues[0]!;
  const [copied, setCopied] = useState(false);
  const sevColor =
    issue.severity === "critical"
      ? "destructive"
      : issue.severity === "medium"
        ? "warning"
        : "info";

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link to="/app/audits/$id" params={{ id }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Badge
          className={cn(
            "capitalize",
            sevColor === "destructive" &&
              "bg-destructive/10 text-destructive border-destructive/30",
            sevColor === "warning" && "bg-warning/10 text-warning border-warning/30",
            sevColor === "info" && "bg-info/10 text-info border-info/30",
          )}
        >
          {issue.severity}
        </Badge>
        <Badge variant="outline">{issue.category}</Badge>
        {issue.wcagRef && (
          <Badge variant="outline" className="text-muted-foreground">
            {issue.wcagRef}
          </Badge>
        )}
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{issue.title}</h1>
        <p className="mt-2 text-muted-foreground">{issue.description}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Impact</div>
          <div className="text-lg font-semibold mt-1">{issue.impact}</div>
        </Card>
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Selector</div>
          <div className="font-mono text-xs mt-1 truncate">{issue.selector}</div>
        </Card>
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Est. score gain</div>
          <div className="text-lg font-semibold mt-1 text-success flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> +{issue.estImprovement}
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-card/60">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Screenshot preview</h3>
        </div>
        <div className="aspect-video rounded-lg border border-border bg-gradient-mesh relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass rounded-xl px-5 py-3 border-2 border-destructive shadow-glow">
            <div className="text-xs font-medium">Detected element</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              {issue.selector}
            </div>
          </div>
          <div className="absolute top-3 left-3 right-3 h-8 rounded-md bg-card/40 backdrop-blur" />
          <div className="absolute bottom-3 left-3 right-3 h-12 rounded-md bg-card/40 backdrop-blur" />
        </div>
      </Card>

      <Card className="p-5 bg-card/60">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-warning" />
          <h3 className="font-semibold text-sm">Recommended fix</h3>
        </div>
        <p className="text-sm">{issue.recommendation}</p>
      </Card>

      <Card className="p-5 bg-card/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Code suggestion</h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(issue.codeAfter);
              setCopied(true);
              toast.success("Copied");
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 mr-1 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1" />
            )}{" "}
            Copy
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">Before</div>
            <pre className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-xs font-mono overflow-x-auto text-foreground whitespace-pre">
              {issue.codeBefore}
            </pre>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">After</div>
            <pre className="rounded-lg bg-success/5 border border-success/20 p-3 text-xs font-mono overflow-x-auto text-foreground whitespace-pre">
              {issue.codeAfter}
            </pre>
          </div>
        </div>
      </Card>

      <Collapsible defaultOpen>
        <Card className="bg-card/60">
          <CollapsibleTrigger className="w-full p-5 flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">UX explanation</h3>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-5 pb-5 text-sm text-muted-foreground space-y-2">
              <p>
                This issue affects approximately{" "}
                <span className="text-foreground font-medium">38%</span> of your visitors, with
                disproportionate impact on users with low vision or relying on assistive technology.
              </p>
              <p>
                Resolving it brings you closer to{" "}
                <span className="text-foreground font-medium">WCAG 2.2 AA conformance</span> and
                reduces the risk of accessibility-related abandonment on this flow.
              </p>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
