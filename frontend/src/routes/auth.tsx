import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-sidebar border-r border-border">
        <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative max-w-md">
          <blockquote className="text-2xl font-medium leading-snug">
            "UXray surfaced 40+ critical accessibility issues we'd missed for years. Our WCAG score
            jumped 28 points in one sprint."
          </blockquote>
          <div className="mt-6 text-sm">
            <div className="font-medium">Sarah Chen</div>
            <div className="text-muted-foreground">Head of Design, FinTech</div>
          </div>
        </div>
        <div className="relative text-xs text-muted-foreground">
          © 2026 UXray Labs ·{" "}
          <Link to="/" className="hover:text-foreground">
            Back to site
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
