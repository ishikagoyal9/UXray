import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_marketing/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — UXray" },
      { name: "description", content: "Free, Pro, and Enterprise plans for teams of any size." },
      { property: "og:title", content: "Pricing — UXray" },
      {
        property: "og:description",
        content: "Free, Pro, and Enterprise plans for teams of any size.",
      },
    ],
  }),
  component: Pricing,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For solo developers exploring accessibility.",
    cta: "Get started",
    features: ["10 audits / month", "1 user", "WCAG AA checks", "5 personas", "Community support"],
  },
  {
    name: "Pro",
    price: "$49",
    period: "/user/mo",
    desc: "For product teams shipping weekly.",
    cta: "Start 14-day trial",
    featured: true,
    features: [
      "Unlimited audits",
      "Up to 10 users",
      "WCAG AAA checks",
      "All 6 personas",
      "Authenticated crawls",
      "GitHub & Linear sync",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations with compliance needs.",
    cta: "Talk to sales",
    features: [
      "Everything in Pro",
      "Unlimited users",
      "SSO / SCIM",
      "Custom scoring models",
      "VPC & on-prem",
      "SLA & dedicated CSM",
      "Audit log & SOC 2 report",
    ],
  },
];

const comparison = [
  ["Audits per month", "10", "Unlimited", "Unlimited"],
  ["Team members", "1", "Up to 10", "Unlimited"],
  ["Persona simulators", "5", "6", "6 + custom"],
  ["WCAG level", "AA", "AAA", "AAA"],
  ["Authenticated crawls", "—", "✓", "✓"],
  ["API access", "—", "✓", "✓"],
  ["SSO / SCIM", "—", "—", "✓"],
  ["Support", "Community", "Priority", "Dedicated CSM"],
];

function Pricing() {
  return (
    <div className="pt-12 pb-24">
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <Badge variant="outline" className="glass text-xs">
            <Sparkles className="h-3 w-3 mr-1 text-primary" /> Simple, transparent pricing
          </Badge>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight">
            Pricing that scales
            <br />
            <span className="gradient-text">with your team.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when your team grows. Cancel anytime.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card
              key={p.name}
              className={cn(
                "p-8 relative flex flex-col",
                p.featured ? "border-primary/60 shadow-glow bg-card" : "bg-card/60",
              )}
            >
              {p.featured && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground border-0">
                  Most popular
                </Badge>
              )}
              <div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </div>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={cn(
                  "w-full mt-8",
                  p.featured
                    ? "bg-gradient-primary text-primary-foreground border-0 shadow-glow"
                    : "",
                )}
                variant={p.featured ? "default" : "outline"}
              >
                <Link to="/auth/sign-up">{p.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="text-2xl font-bold text-center">Compare plans</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] glass rounded-2xl">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left p-4 text-sm font-medium">Feature</th>
                  <th className="p-4 text-sm">Free</th>
                  <th className="p-4 text-sm gradient-text font-semibold">Pro</th>
                  <th className="p-4 text-sm">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([f, a, b, c]) => (
                  <tr key={f} className="border-b border-border/40 last:border-0">
                    <td className="p-4 text-sm">{f}</td>
                    <td className="p-4 text-center text-sm text-muted-foreground">{a}</td>
                    <td className="p-4 text-center text-sm bg-primary/5">{b}</td>
                    <td className="p-4 text-center text-sm">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
