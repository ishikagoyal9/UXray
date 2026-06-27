import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Sparkles,
  ShieldCheck,
  Eye,
  Zap,
  Brain,
  BarChart3,
  Users,
  Code2,
  Play,
  Star,
  Quote,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  wcagPrinciples,
  heuristics,
  competitorComparison,
  testimonials,
  trustedLogos,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_marketing/")({
  head: () => ({
    meta: [
      { title: "UXray — AI-powered UX & Accessibility audits" },
      {
        name: "description",
        content:
          "Audit any web product for WCAG 2.2, Nielsen heuristics, and DOM quality through AI personas. Get prioritized fixes with code snippets.",
      },
      { property: "og:title", content: "UXray — AI-powered UX & Accessibility audits" },
      {
        property: "og:description",
        content:
          "Audit any web product for WCAG, Nielsen heuristics, and DOM quality through AI personas.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Problem />
      <Features />
      <HowItWorks />
      <Accessibility />
      <Heuristics />
      <ScoreSystem />
      <Comparison />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute inset-0 grid-bg" />
      <div className="relative mx-auto max-w-6xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="glass border-border/60 px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3 w-3 mr-1.5 text-primary" /> New: Persona-based auditing is live
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="mt-6 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Ship interfaces that work
          <br />
          <span className="gradient-text">for everyone.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          UXray audits your site for WCAG 2.2, Nielsen heuristics, and DOM quality through six AI
          personas — and ships you a prioritized fix list with code.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90 h-12 px-6"
          >
            <Link to="/auth/sign-up">
              Start free audit <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 glass">
            <Link to="/app/dashboard">
              <Play className="h-4 w-4 mr-2" /> See live demo
            </Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-16 relative"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute -inset-4 bg-gradient-aurora opacity-30 blur-3xl rounded-full" />
      <div className="relative glass rounded-2xl border border-border shadow-elegant overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60">
          <span className="h-3 w-3 rounded-full bg-destructive/60" />
          <span className="h-3 w-3 rounded-full bg-warning/60" />
          <span className="h-3 w-3 rounded-full bg-success/60" />
          <div className="ml-4 text-xs text-muted-foreground font-mono">
            app.uxray.app/dashboard
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4 p-6">
          {[
            { label: "UX Score", val: 87, color: "from-violet-500 to-fuchsia-500" },
            { label: "WCAG", val: 92, color: "from-blue-500 to-cyan-500" },
            { label: "Heuristic", val: 81, color: "from-emerald-500 to-teal-500" },
            { label: "DOM", val: 89, color: "from-amber-500 to-orange-500" },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="rounded-xl p-4 bg-card/60 border border-border"
            >
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div
                className={`text-3xl font-bold bg-gradient-to-br ${m.color} bg-clip-text text-transparent mt-1`}
              >
                {m.val}
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.val}%` }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${m.color}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="px-6 pb-6 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-xl border border-border bg-card/40 p-4">
            <div className="text-sm font-medium mb-3">Score trend · 14 days</div>
            <div className="h-32 flex items-end gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${30 + Math.sin(i / 2) * 25 + i * 1.4}%` }}
                  transition={{ delay: 0.7 + i * 0.015 }}
                  className="flex-1 rounded-t bg-gradient-to-t from-primary/70 to-primary"
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card/40 p-4">
            <div className="text-sm font-medium mb-3">Top issues</div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive" /> Contrast on CTA
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-warning" /> Missing alt text
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-info" /> Focus indicator
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-warning" /> Heading skip
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustedBy() {
  return (
    <section className="py-16 border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
          Trusted by product teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
          {trustedLogos.map((l) => (
            <div key={l} className="text-2xl font-bold tracking-tight">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    {
      icon: Eye,
      title: "Accessibility is invisible",
      desc: "1 in 4 users have disabilities. Most teams ship without ever testing for them.",
    },
    {
      icon: Zap,
      title: "Manual audits don't scale",
      desc: "Consultancy reports go stale in weeks. Your product ships daily.",
    },
    {
      icon: Brain,
      title: "Heuristics get forgotten",
      desc: "Nielsen's 10 principles live in textbooks, not in your pull request workflow.",
    },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs">
            The problem
          </Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            UX debt is invisible until it isn't.
          </h2>
          <p className="mt-4 text-muted-foreground">
            By the time accessibility lawsuits, churn, or 1-star reviews hit, the damage is done.
          </p>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 h-full bg-card/60 border-border/60 hover:border-border transition-colors">
                <div className="h-10 w-10 rounded-lg bg-gradient-aurora grid place-items-center text-white">
                  <it.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const feats = [
    {
      icon: ShieldCheck,
      title: "WCAG 2.2 AAA engine",
      desc: "78 success criteria, evaluated automatically with reproducible evidence.",
    },
    {
      icon: Brain,
      title: "Nielsen heuristics",
      desc: "AI-graded against all 10 principles with contextual reasoning.",
    },
    {
      icon: Users,
      title: "6 persona simulators",
      desc: "Senior, low-vision, color-blind, screen reader, student, professional.",
    },
    {
      icon: Code2,
      title: "AI fix suggestions",
      desc: "Drop-in code snippets, validated against your design tokens.",
    },
    {
      icon: BarChart3,
      title: "Continuous monitoring",
      desc: "Re-audit every deploy. Track score drift across releases.",
    },
    {
      icon: Zap,
      title: "Team workflows",
      desc: "Assign, comment, resolve. Native GitHub & Linear integrations.",
    },
  ];
  return (
    <section className="py-24 bg-card/30 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs">
            Features
          </Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Everything your team needs
            <br />
            to ship accessible UX.
          </h2>
        </div>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-6 h-full bg-background/60 border-border/60 hover:shadow-glow hover:border-primary/40 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-accent group-hover:bg-gradient-aurora group-hover:text-white grid place-items-center transition-all">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Drop in a URL",
      desc: "Paste any public or staging URL. We crawl, render, and snapshot.",
    },
    {
      n: "02",
      title: "Pick personas & devices",
      desc: "Choose who to audit for. Run desktop, tablet, mobile in parallel.",
    },
    {
      n: "03",
      title: "Get prioritized fixes",
      desc: "Severity-ranked issues with code snippets, ready to ship.",
    },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs">
            How it works
          </Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            From URL to fix in 90 seconds.
          </h2>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto h-24 w-24 rounded-2xl glass border-border grid place-items-center text-3xl font-bold gradient-text shadow-elegant">
                {s.n}
              </div>
              <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Accessibility() {
  return (
    <section className="py-24 bg-card/30 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="text-xs">
              Accessibility
            </Badge>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              The four
              <br />
              <span className="gradient-text">WCAG principles.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              We grade every page against POUR — the foundation of WCAG 2.2 — and roll the results
              into a single, comparable score.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {wcagPrinciples.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 border-border/60"
              >
                <div
                  className="h-12 w-12 rounded-xl grid place-items-center text-xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}, color-mix(in oklab, ${p.color} 70%, white))`,
                  }}
                >
                  {p.letter}
                </div>
                <h3 className="mt-4 font-semibold">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Heuristics() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs">
            UX heuristics
          </Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            All 10 Nielsen heuristics.
            <br />
            Continuously evaluated.
          </h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {heuristics.map((h, i) => (
            <motion.div
              key={h}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-border bg-card/60 p-4 hover:border-primary/40 transition"
            >
              <div className="text-xs text-muted-foreground font-mono">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-1 text-sm font-medium leading-snug">{h}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScoreSystem() {
  const breakdown = [
    { label: "WCAG compliance", weight: 40, color: "bg-chart-1" },
    { label: "Nielsen heuristics", weight: 30, color: "bg-chart-2" },
    { label: "DOM quality", weight: 20, color: "bg-chart-3" },
    { label: "Performance", weight: 10, color: "bg-chart-4" },
  ];
  return (
    <section className="py-24 bg-card/30 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Badge variant="outline" className="text-xs">
            Scoring
          </Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            One number.
            <br />
            Zero ambiguity.
          </h2>
          <p className="mt-4 text-muted-foreground">
            The UXray Score combines weighted sub-scores into a single 0–100 metric your team can
            rally around.
          </p>
          <div className="mt-8 space-y-4">
            {breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{b.label}</span>
                  <span className="text-muted-foreground font-mono">{b.weight}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.weight * 2.5}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${b.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-square max-w-md mx-auto w-full">
          <div className="absolute inset-0 bg-gradient-aurora opacity-30 blur-3xl rounded-full animate-pulse-glow" />
          <div className="relative h-full w-full rounded-full border border-border glass grid place-items-center">
            <div className="text-center">
              <div className="text-7xl font-bold gradient-text">94</div>
              <div className="text-sm text-muted-foreground mt-1">UXray Score</div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs text-success">
                <Check className="h-3 w-3" /> WCAG AA passing
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const Cell = ({ v }: { v: boolean | string }) =>
    v === true ? (
      <Check className="h-4 w-4 text-success mx-auto" />
    ) : v === false ? (
      <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
    ) : (
      <span className="text-xs text-muted-foreground">{v}</span>
    );
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs">
            Comparison
          </Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Why teams switch to UXray.
          </h2>
        </div>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] glass rounded-2xl overflow-hidden">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left p-4 text-sm font-medium">Feature</th>
                <th className="p-4 text-sm font-semibold gradient-text">UXray</th>
                <th className="p-4 text-sm text-muted-foreground">axe DevTools</th>
                <th className="p-4 text-sm text-muted-foreground">Lighthouse</th>
                <th className="p-4 text-sm text-muted-foreground">WAVE</th>
              </tr>
            </thead>
            <tbody>
              {competitorComparison.map((r) => (
                <tr key={r.feature} className="border-b border-border/40 last:border-0">
                  <td className="p-4 text-sm">{r.feature}</td>
                  <td className="p-4 text-center bg-primary/5">
                    <Cell v={r.us} />
                  </td>
                  <td className="p-4 text-center">
                    <Cell v={r.axe} />
                  </td>
                  <td className="p-4 text-center">
                    <Cell v={r.lighthouse} />
                  </td>
                  <td className="p-4 text-center">
                    <Cell v={r.wave} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 bg-card/30 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="outline" className="text-xs">
            Loved by teams
          </Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Built for shipping teams.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 h-full glass border-border/60 relative">
                <Quote className="h-6 w-6 text-primary/30 absolute top-4 right-4" />
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-aurora grid place-items-center text-white text-xs font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    [
      "What does UXray actually audit?",
      "Public web pages and authenticated routes. We render with a headless browser, snapshot the DOM, and run WCAG, heuristic, and DOM-quality checks.",
    ],
    [
      "How is this different from axe or Lighthouse?",
      "Those tools cover automated WCAG checks. UXray adds AI-graded heuristics, persona simulation, and fix code generation.",
    ],
    [
      "Can I run audits on staging or behind auth?",
      "Yes — Pro and Enterprise plans support authenticated crawls via stored sessions or magic links.",
    ],
    [
      "Do you store our website data?",
      "Snapshots and screenshots are encrypted at rest and deleted after 90 days. You can opt out of retention entirely.",
    ],
    [
      "Is there a free tier?",
      "Yes — 10 audits/month, 1 user, all core checks. No credit card required.",
    ],
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            FAQ
          </Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">Frequently asked.</h2>
        </div>
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={i} value={`f${i}`} className="border-border/60">
              <AccordionTrigger className="text-left text-base font-medium">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl glass border-border p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Audit your first page
              <br />
              in under a minute.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Free forever for solo developers. No credit card. No lock-in.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-primary text-primary-foreground border-0 shadow-glow h-12 px-6"
              >
                <Link to="/auth/sign-up">
                  Start auditing <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <Link to="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
