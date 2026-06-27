import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — UXray" },
      { name: "description", content: "Reset your UXray password." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-success/10 grid place-items-center">
          <Check className="h-6 w-6 text-success" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Check your email</h1>
        <p className="mt-1 text-sm text-muted-foreground">We sent a reset link to your inbox.</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/auth/sign-in">Back to sign in</Link>
        </Button>
      </div>
    );
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="text-sm text-muted-foreground mt-1">We'll email you a link to reset it.</p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-primary text-primary-foreground border-0 shadow-glow"
        >
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/auth/sign-in" className="text-foreground font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
