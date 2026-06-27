export type Severity = "critical" | "medium" | "low";
export type IssueCategory = "WCAG" | "Heuristic" | "DOM" | "Performance";

export type Issue = {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: IssueCategory;
  impact: "High" | "Medium" | "Low";
  selector: string;
  recommendation: string;
  codeBefore: string;
  codeAfter: string;
  estImprovement: number;
  wcagRef?: string;
  heuristicRef?: string;
};

export type Audit = {
  id: string;
  url: string;
  domain: string;
  date: string;
  status: "completed" | "running" | "failed";
  scores: { overall: number; wcag: number; heuristic: number; dom: number };
  device: "Desktop" | "Tablet" | "Mobile";
  persona: string;
  issues: { critical: number; medium: number; low: number };
};

export const audits: Audit[] = [
  {
    id: "aud_01",
    url: "https://acme.com/checkout",
    domain: "acme.com",
    date: "2026-06-26T14:20:00Z",
    status: "completed",
    scores: { overall: 78, wcag: 82, heuristic: 74, dom: 79 },
    device: "Desktop",
    persona: "Working Professional",
    issues: { critical: 4, medium: 11, low: 23 },
  },
  {
    id: "aud_02",
    url: "https://stripe.com/pricing",
    domain: "stripe.com",
    date: "2026-06-25T09:11:00Z",
    status: "completed",
    scores: { overall: 94, wcag: 96, heuristic: 92, dom: 95 },
    device: "Desktop",
    persona: "Senior Citizen",
    issues: { critical: 0, medium: 3, low: 8 },
  },
  {
    id: "aud_03",
    url: "https://linear.app",
    domain: "linear.app",
    date: "2026-06-24T18:42:00Z",
    status: "completed",
    scores: { overall: 91, wcag: 89, heuristic: 94, dom: 90 },
    device: "Mobile",
    persona: "Student",
    issues: { critical: 1, medium: 4, low: 12 },
  },
  {
    id: "aud_04",
    url: "https://notion.so/templates",
    domain: "notion.so",
    date: "2026-06-23T11:02:00Z",
    status: "completed",
    scores: { overall: 84, wcag: 80, heuristic: 88, dom: 85 },
    device: "Desktop",
    persona: "Low Vision User",
    issues: { critical: 2, medium: 7, low: 15 },
  },
  {
    id: "aud_05",
    url: "https://vercel.com/dashboard",
    domain: "vercel.com",
    date: "2026-06-22T07:30:00Z",
    status: "running",
    scores: { overall: 0, wcag: 0, heuristic: 0, dom: 0 },
    device: "Desktop",
    persona: "Working Professional",
    issues: { critical: 0, medium: 0, low: 0 },
  },
  {
    id: "aud_06",
    url: "https://airbnb.com/search",
    domain: "airbnb.com",
    date: "2026-06-21T22:14:00Z",
    status: "completed",
    scores: { overall: 72, wcag: 70, heuristic: 76, dom: 71 },
    device: "Mobile",
    persona: "Color Blind User",
    issues: { critical: 5, medium: 14, low: 28 },
  },
  {
    id: "aud_07",
    url: "https://github.com/explore",
    domain: "github.com",
    date: "2026-06-20T15:55:00Z",
    status: "completed",
    scores: { overall: 88, wcag: 86, heuristic: 90, dom: 87 },
    device: "Desktop",
    persona: "Screen Reader User",
    issues: { critical: 1, medium: 6, low: 11 },
  },
  {
    id: "aud_08",
    url: "https://figma.com/community",
    domain: "figma.com",
    date: "2026-06-19T12:00:00Z",
    status: "failed",
    scores: { overall: 0, wcag: 0, heuristic: 0, dom: 0 },
    device: "Tablet",
    persona: "Student",
    issues: { critical: 0, medium: 0, low: 0 },
  },
];

export const issues: Issue[] = [
  {
    id: "iss_01",
    title: "Insufficient color contrast on primary CTA",
    description:
      "The primary 'Checkout' button has a contrast ratio of 3.2:1 against its background, below the WCAG AA threshold of 4.5:1 for normal text.",
    severity: "critical",
    category: "WCAG",
    impact: "High",
    selector: "button.btn-primary",
    recommendation:
      "Darken the button background to #5B21B6 or use white text with a darker primary tone to reach at least 4.5:1.",
    codeBefore: `<button class="bg-violet-300 text-white">\n  Checkout\n</button>`,
    codeAfter: `<button class="bg-violet-700 text-white">\n  Checkout\n</button>`,
    estImprovement: 8,
    wcagRef: "1.4.3 Contrast (Minimum)",
  },
  {
    id: "iss_02",
    title: "Form inputs missing accessible labels",
    description:
      "5 form fields on the checkout page rely on placeholder text only. Screen readers cannot announce these fields to users.",
    severity: "critical",
    category: "WCAG",
    impact: "High",
    selector: "input[name='email']",
    recommendation:
      "Add a <label> element associated via htmlFor, or use aria-label for icon-only inputs.",
    codeBefore: `<input placeholder="Email" />`,
    codeAfter: `<label for="email">Email</label>\n<input id="email" placeholder="you@company.com" />`,
    estImprovement: 6,
    wcagRef: "1.3.1 Info and Relationships",
  },
  {
    id: "iss_03",
    title: "Navigation lacks visible focus indicator",
    description:
      "Keyboard users cannot determine which navigation item is currently focused. Default outline has been removed without replacement.",
    severity: "critical",
    category: "Heuristic",
    impact: "High",
    selector: "nav a",
    recommendation:
      "Add a visible focus ring using focus-visible pseudo-class with a high-contrast outline.",
    codeBefore: `a:focus { outline: none; }`,
    codeAfter: `a:focus-visible {\n  outline: 2px solid var(--ring);\n  outline-offset: 2px;\n}`,
    estImprovement: 5,
    heuristicRef: "Visibility of system status",
  },
  {
    id: "iss_04",
    title: "Error message disappears too quickly",
    description:
      "Toast notifications dismiss after 1.5s, below the WCAG minimum for accessible timing.",
    severity: "medium",
    category: "Heuristic",
    impact: "Medium",
    selector: ".toast",
    recommendation: "Increase toast duration to at least 5 seconds or allow user dismissal.",
    codeBefore: `toast({ duration: 1500 })`,
    codeAfter: `toast({ duration: 6000, dismissible: true })`,
    estImprovement: 3,
    heuristicRef: "Help users recognize, diagnose, and recover from errors",
  },
  {
    id: "iss_05",
    title: "Images missing descriptive alt text",
    description: "12 hero images use empty or generic alt attributes such as 'image' or 'photo'.",
    severity: "medium",
    category: "WCAG",
    impact: "Medium",
    selector: "img.hero",
    recommendation:
      "Write descriptive alt text that conveys image purpose, or use alt='' for decorative images.",
    codeBefore: `<img src="hero.jpg" alt="image" />`,
    codeAfter: `<img src="hero.jpg" alt="Team collaborating in a sunlit office" />`,
    estImprovement: 4,
    wcagRef: "1.1.1 Non-text Content",
  },
  {
    id: "iss_06",
    title: "Click targets smaller than 44x44px",
    description:
      "Mobile navigation icons are 32x32px, below Apple HIG and WCAG 2.5.5 recommendations.",
    severity: "medium",
    category: "Heuristic",
    impact: "Medium",
    selector: ".nav-icon",
    recommendation: "Increase padding to ensure a minimum 44x44 hit area on touch devices.",
    codeBefore: `.nav-icon { padding: 4px; }`,
    codeAfter: `.nav-icon { padding: 12px; min-width: 44px; min-height: 44px; }`,
    estImprovement: 3,
    heuristicRef: "Flexibility and efficiency of use",
  },
  {
    id: "iss_07",
    title: "Heading hierarchy skips levels",
    description: "Page jumps from h1 to h4, breaking screen reader navigation structure.",
    severity: "low",
    category: "DOM",
    impact: "Low",
    selector: "h4.section-title",
    recommendation: "Use sequential heading levels (h1 → h2 → h3) to preserve document outline.",
    codeBefore: `<h1>Title</h1>\n<h4>Section</h4>`,
    codeAfter: `<h1>Title</h1>\n<h2>Section</h2>`,
    estImprovement: 2,
    wcagRef: "1.3.1 Info and Relationships",
  },
  {
    id: "iss_08",
    title: "Animated banner has no pause control",
    description:
      "Auto-rotating carousel runs continuously with no way to pause for users with cognitive disabilities.",
    severity: "low",
    category: "WCAG",
    impact: "Low",
    selector: ".hero-carousel",
    recommendation: "Add pause/play controls and respect prefers-reduced-motion.",
    codeBefore: `<Carousel autoplay />`,
    codeAfter: `<Carousel autoplay pauseOnHover controls />`,
    estImprovement: 2,
    wcagRef: "2.2.2 Pause, Stop, Hide",
  },
  {
    id: "iss_09",
    title: "Inconsistent button styles across pages",
    description:
      "Three different primary button styles detected across 8 pages, breaking visual consistency.",
    severity: "low",
    category: "Heuristic",
    impact: "Low",
    selector: ".btn",
    recommendation: "Consolidate into a single Button component with documented variants.",
    codeBefore: `// Mixed inline styles`,
    codeAfter: `<Button variant="primary" size="lg">Submit</Button>`,
    estImprovement: 2,
    heuristicRef: "Consistency and standards",
  },
  {
    id: "iss_10",
    title: "Excessive DOM depth in product grid",
    description: "Product cards nest 14 levels deep, slowing render and complicating maintenance.",
    severity: "medium",
    category: "DOM",
    impact: "Medium",
    selector: ".product-card",
    recommendation: "Flatten nesting using semantic HTML and CSS grid utilities.",
    codeBefore: `<div><div><div>...14 deep`,
    codeAfter: `<article class="grid">...3 deep`,
    estImprovement: 4,
  },
];

export const scoreTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `Jun ${i + 13}`,
  overall: 70 + Math.round(Math.sin(i / 2) * 8 + i * 1.2),
  wcag: 72 + Math.round(Math.cos(i / 2) * 6 + i * 1.1),
  heuristic: 68 + Math.round(Math.sin(i / 1.5) * 7 + i * 1.3),
}));

export const issueDistribution = [
  { name: "WCAG", value: 42, color: "var(--chart-1)" },
  { name: "Heuristic", value: 31, color: "var(--chart-2)" },
  { name: "DOM", value: 18, color: "var(--chart-3)" },
  { name: "Performance", value: 9, color: "var(--chart-4)" },
];

export const severityDistribution = [
  { name: "Critical", value: 13, color: "var(--destructive)" },
  { name: "Medium", value: 45, color: "var(--warning)" },
  { name: "Low", value: 97, color: "var(--info)" },
];

export const accessibilityChecks = [
  { name: "Color Contrast", passed: 142, failed: 8, score: 95 },
  { name: "Alt Text", passed: 89, failed: 12, score: 88 },
  { name: "Keyboard Nav", passed: 56, failed: 4, score: 93 },
  { name: "Screen Reader", passed: 71, failed: 9, score: 89 },
  { name: "Form Labels", passed: 38, failed: 5, score: 88 },
  { name: "ARIA Roles", passed: 62, failed: 3, score: 95 },
];

export const personas = [
  {
    id: "student",
    name: "Student",
    icon: "🎓",
    desc: "Young adult, mobile-first, fast scanning behavior",
    impactScore: 84,
    criticalIssues: 3,
    color: "var(--chart-2)",
  },
  {
    id: "senior",
    name: "Senior Citizen",
    icon: "👴",
    desc: "Older adult, prefers larger text, slower navigation",
    impactScore: 62,
    criticalIssues: 11,
    color: "var(--chart-5)",
  },
  {
    id: "professional",
    name: "Working Professional",
    icon: "💼",
    desc: "Task-focused, time-constrained, desktop primary",
    impactScore: 88,
    criticalIssues: 2,
    color: "var(--chart-1)",
  },
  {
    id: "low-vision",
    name: "Low Vision User",
    icon: "🔍",
    desc: "Uses zoom and high contrast modes",
    impactScore: 58,
    criticalIssues: 14,
    color: "var(--chart-4)",
  },
  {
    id: "color-blind",
    name: "Color Blind User",
    icon: "🎨",
    desc: "Deuteranopia / Protanopia / Tritanopia variants",
    impactScore: 74,
    criticalIssues: 6,
    color: "var(--chart-3)",
  },
  {
    id: "screen-reader",
    name: "Screen Reader User",
    icon: "🔊",
    desc: "Navigates exclusively via assistive technology",
    impactScore: 51,
    criticalIssues: 17,
    color: "var(--destructive)",
  },
];

export const activityFeed = [
  {
    id: 1,
    type: "audit_completed",
    actor: "You",
    target: "stripe.com/pricing",
    time: "2 minutes ago",
    score: 94,
  },
  {
    id: 2,
    type: "issue_fixed",
    actor: "Sarah Chen",
    target: "Color contrast on CTA",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "audit_started",
    actor: "Marcus Liu",
    target: "vercel.com/dashboard",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "report_shared",
    actor: "You",
    target: "Q2 Accessibility Report",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "comment",
    actor: "Priya Patel",
    target: "Mobile nav hit area",
    time: "Yesterday",
  },
  {
    id: 6,
    type: "audit_completed",
    actor: "You",
    target: "linear.app",
    time: "2 days ago",
    score: 91,
  },
];

export const wcagPrinciples = [
  {
    letter: "P",
    name: "Perceivable",
    desc: "Information must be presentable in ways users can perceive.",
    color: "var(--chart-1)",
  },
  {
    letter: "O",
    name: "Operable",
    desc: "Interface components must be operable by all users.",
    color: "var(--chart-2)",
  },
  {
    letter: "U",
    name: "Understandable",
    desc: "Information and operation must be understandable.",
    color: "var(--chart-3)",
  },
  {
    letter: "R",
    name: "Robust",
    desc: "Content must be robust enough for assistive technologies.",
    color: "var(--chart-4)",
  },
];

export const heuristics = [
  "Visibility of system status",
  "Match between system and real world",
  "User control and freedom",
  "Consistency and standards",
  "Error prevention",
  "Recognition rather than recall",
  "Flexibility and efficiency of use",
  "Aesthetic and minimalist design",
  "Help users recognize and recover from errors",
  "Help and documentation",
];

export const testimonials = [
  {
    quote:
      "Surfaced 40+ critical accessibility issues we'd missed for years. Our WCAG score jumped 28 points in one sprint.",
    name: "Sarah Chen",
    role: "Head of Design, Linear-style startup",
    avatar: "SC",
  },
  {
    quote:
      "The persona-based audits changed how we think about UX. We now design for screen readers from day one.",
    name: "Marcus Liu",
    role: "Principal Engineer, FinTech",
    avatar: "ML",
  },
  {
    quote:
      "Before/after previews make it trivial to ship fixes. PMs actually understand the impact now.",
    name: "Priya Patel",
    role: "Product Lead, SaaS",
    avatar: "PP",
  },
];

export const competitorComparison = [
  {
    feature: "WCAG 2.2 Coverage",
    us: "Full AAA",
    axe: "AA only",
    lighthouse: "Partial",
    wave: "AA only",
  },
  { feature: "Nielsen Heuristic Engine", us: true, axe: false, lighthouse: false, wave: false },
  { feature: "Persona-based Auditing", us: true, axe: false, lighthouse: false, wave: false },
  { feature: "AI Fix Suggestions", us: true, axe: false, lighthouse: false, wave: false },
  { feature: "Before/After Preview", us: true, axe: false, lighthouse: false, wave: false },
  { feature: "Continuous Monitoring", us: true, axe: true, lighthouse: false, wave: false },
  { feature: "Team Collaboration", us: true, axe: "Limited", lighthouse: false, wave: false },
  { feature: "Custom Scoring Models", us: true, axe: false, lighthouse: false, wave: false },
];

export const trustedLogos = ["Linear", "Vercel", "Stripe", "Notion", "Figma", "Loom"];

export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; time: string };
export type ChatThread = { id: string; title: string; messages: ChatMessage[]; updated: string };

export const chatThreads: ChatThread[] = [
  {
    id: "ct_01",
    title: "Fix contrast on checkout",
    updated: "2m ago",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Why is my checkout button failing contrast?",
        time: "10:14 AM",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Your `button.btn-primary` uses `#A78BFA` on `#FFFFFF`, which yields a 3.2:1 contrast ratio. WCAG AA requires 4.5:1 for normal text. Switching to `#5B21B6` gives you 8.1:1 and resolves the issue while keeping brand identity intact.",
        time: "10:14 AM",
      },
    ],
  },
  { id: "ct_02", title: "Persona audit for senior users", updated: "1h ago", messages: [] },
  { id: "ct_03", title: "Lighthouse vs our scoring", updated: "Yesterday", messages: [] },
  { id: "ct_04", title: "Bulk fix navigation focus rings", updated: "3 days ago", messages: [] },
];

export const suggestedPrompts = [
  "What are my top 3 critical issues this week?",
  "Generate a fix PR for color contrast issues",
  "How does my site score for screen reader users?",
  "Compare my audit scores to industry benchmarks",
];
