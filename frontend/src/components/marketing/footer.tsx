import { Logo } from "@/components/logo";
import { Link } from "@tanstack/react-router";

const cols = [
  {
    title: "Product",
    links: [
      ["Features", "/"],
      ["Pricing", "/pricing"],
      ["Dashboard", "/app/dashboard"],
      ["Changelog", "/"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["WCAG guide", "/"],
      ["Heuristics", "/"],
      ["Blog", "/"],
      ["API docs", "/"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/"],
      ["Careers", "/"],
      ["Contact", "/"],
      ["Press", "/"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy", "/"],
      ["Terms", "/"],
      ["Security", "/"],
      ["DPA", "/"],
    ],
  },
] as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Ship accessible, intuitive web experiences. Audited by AI.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-semibold mb-3">{c.title}</div>
              <ul className="space-y-2">
                {c.links.map(([l, href]) => (
                  <li key={l}>
                    <Link
                      to={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© 2026 UXray Labs, Inc. All rights reserved.</div>
          <div className="flex gap-4">
            <span>SOC 2 Type II</span>
            <span>GDPR</span>
            <span>WCAG 2.2 AAA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
