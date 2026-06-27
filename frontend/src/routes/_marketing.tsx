import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

export const Route = createFileRoute("/_marketing")({
  component: MarketingLayout,
});

function MarketingLayout() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <Outlet />
      <MarketingFooter />
    </div>
  );
}
