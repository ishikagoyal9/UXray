import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Search, FileText, Plus, ExternalLink } from "lucide-react";
import { domainFromUrl, downloadAuditPdf, getReports, scanToAudit, type ScanResult } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/app/audits/")({
  head: () => ({
    meta: [
      { title: "Audits — UXray" },
      { name: "description", content: "Live audits and reports." },
    ],
  }),
  component: AuditsList,
});

function AuditsList() {
  const [q, setQ] = useState("");
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    getReports().then(setHistory);
  }, []);

  const audits = useMemo(() => history.map((scan, index) => scanToAudit(scan, scan.id ?? `scan_${index}`)), [history]);
  const filtered = audits.filter((a) => `${a.url} ${a.persona} ${a.domain}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Audits & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {audits.length} live scan{audits.length === 1 ? "" : "s"} saved in backend history
          </p>
        </div>
        <Button asChild className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <Link to="/app/audits/new"><Plus className="h-4 w-4 mr-1" /> New audit</Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search live audits by URL…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 bg-card/60 text-center space-y-4">
          <h2 className="text-xl font-semibold">No live audits yet</h2>
          <p className="text-sm text-muted-foreground">Run your first audit to generate a real report. Mock audit cards have been removed.</p>
          <Button asChild className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"><Link to="/app/audits/new">Start new audit</Link></Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => {
            const scan = history.find((item) => item.id === a.id) ?? history[0];
            return (
            <Card key={`${a.id}-${a.url}`} className="p-5 bg-card/60 hover:shadow-elegant hover:border-primary/40 transition-all group">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <Link to="/app/audits/$id" params={{ id: a.id }} className="font-semibold hover:underline truncate block">{domainFromUrl(a.url)}</Link>
                  <div className="text-xs text-muted-foreground truncate flex items-center gap-1"><ExternalLink className="h-3 w-3" />{a.url.replace(/^https?:\/\//, "")}</div>
                </div>
                <ScoreCircle value={a.scores.overall} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5"><Badge variant="secondary" className="text-xs">{a.device}</Badge><Badge variant="secondary" className="text-xs">{a.persona}</Badge><Badge variant="outline" className="text-xs">{a.scores.overall >= 80 ? "Good" : "Needs work"}</Badge></div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-destructive/10 py-1.5"><div className="text-sm font-semibold text-destructive">{a.issues.critical}</div><div className="text-[10px] text-muted-foreground">Critical/High</div></div>
                <div className="rounded-md bg-warning/10 py-1.5"><div className="text-sm font-semibold text-warning">{a.issues.medium}</div><div className="text-[10px] text-muted-foreground">Medium</div></div>
                <div className="rounded-md bg-info/10 py-1.5"><div className="text-sm font-semibold text-info">{a.issues.low}</div><div className="text-[10px] text-muted-foreground">Low</div></div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Saved in reports/</div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => scan && downloadAuditPdf(scan) }><Download className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.success("Report is saved in backend history") }><Share2 className="h-3.5 w-3.5" /></Button>
                  <Button asChild size="icon" variant="ghost" className="h-8 w-8"><Link to="/app/audits/$id" params={{ id: a.id }}><FileText className="h-3.5 w-3.5" /></Link></Button>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ScoreCircle({ value }: { value: number }) {
  const color = value >= 90 ? "text-success" : value >= 75 ? "text-warning" : "text-destructive";
  return <div className={`h-12 w-12 rounded-full border-2 ${color.replace("text-", "border-")} grid place-items-center ${color}`}><span className="text-sm font-bold">{value}</span></div>;
}
