import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lightbulb, Code2, TrendingUp, ChevronDown, Copy, Check, MessageSquare } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { fetchReport, scanToIssues, screenshotUrl, type ScanResult } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/audits/$id/issues/$issueId")({
  head: ({ params }) => ({
    meta: [
      { title: `Issue ${params.issueId} — UXray` },
      { name: "description", content: "Live issue details." },
    ],
  }),
  component: IssueDetail,
});

function IssueDetail() {
  const { id, issueId } = Route.useParams();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => { fetchReport(id).then(setScan); }, [id]);
  const issue = scan ? scanToIssues(scan).find((i) => i.id === issueId) : null;

  if (!scan || !issue) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        <Card className="p-8 bg-card/60 text-center space-y-4">
          <h1 className="text-2xl font-bold">Issue not found</h1>
          <p className="text-sm text-muted-foreground">Run a live audit first, then open an issue from the report.</p>
          <Button asChild className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
            <Link to="/app/audits/new">Start new audit</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const sevColor = issue.severity === "critical" ? "destructive" : issue.severity === "medium" ? "warning" : "info";

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 flex-wrap">
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
        <Button asChild variant="outline" size="sm" className="ml-auto">
          <Link to="/app/chat">
            <MessageSquare className="h-3.5 w-3.5 mr-1" /> Ask AI about this
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{issue.title}</h1>
        <p className="mt-2 text-muted-foreground">{issue.description}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Impact</div>
          <div className="text-lg font-semibold mt-1">{issue.impact}</div>
        </Card>
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Detected element</div>
          <div className="font-mono text-xs mt-1 truncate">{issue.selector}</div>
        </Card>
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Est. score gain</div>
          <div className="text-lg font-semibold mt-1 text-success flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> +{issue.estImprovement}
          </div>
        </Card>
        <Card className="p-4 bg-card/60">
          <div className="text-xs text-muted-foreground">Page</div>
          <div className="text-sm font-semibold mt-1 truncate">
            {(issue as any).pageType || (issue as any).pageTitle || "Captured page"}
          </div>
          <div className="text-[11px] text-muted-foreground truncate mt-1">
            {(issue as any).pageUrl || scan.url}
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-card/60 overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div>
            <h3 className="font-semibold text-sm">Issue page screenshot</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {(issue as any).pageType || (issue as any).pageTitle || "Captured page"} ·{" "}
              {(issue as any).pageUrl || scan.url}
            </p>
          </div>
          <Badge variant="outline">{(issue as any).pageType || "Page"}</Badge>
        </div>

        {screenshotUrl((issue as any).screenshot) ? (
          <div className="rounded-xl border border-border bg-muted/20 overflow-auto max-h-[520px]">
            <img
              src={screenshotUrl((issue as any).screenshot)}
              alt="Issue-specific page screenshot"
              className="w-full rounded-lg"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">
            No issue-specific screenshot returned for this finding.
          </div>
        )}
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
            <h3 className="font-semibold text-sm">Code / element suggestion</h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(issue.codeAfter || issue.recommendation);
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
            <div className="text-xs text-muted-foreground mb-1.5">Before / selector</div>
            <pre className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-xs font-mono overflow-x-auto text-foreground whitespace-pre-wrap">
              {issue.codeBefore || issue.selector}
            </pre>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">Suggested fix</div>
            <pre className="rounded-lg bg-success/5 border border-success/20 p-3 text-xs font-mono overflow-x-auto text-foreground whitespace-pre-wrap">
              {issue.codeAfter || issue.recommendation}
            </pre>
          </div>
        </div>
      </Card>

      <Collapsible defaultOpen>
        <Card className="bg-card/60">
          <CollapsibleTrigger className="w-full p-5 flex items-center justify-between group">
            <h3 className="font-semibold text-sm">UX explanation</h3>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-5 pb-5 text-sm text-muted-foreground space-y-2">
              <p>
                This is a live backend-generated finding from the {issue.category} module, not mock
                report data.
              </p>
              <p>
                Fixing it can improve usability, accessibility, and the final UX score. Use the AI
                Assistant only to explain or refine the fix conversationally.
              </p>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
