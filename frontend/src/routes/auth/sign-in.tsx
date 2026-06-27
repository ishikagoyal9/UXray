import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — UXray" },
      { name: "description", content: "Sign in to your UXray workspace." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-sm text-muted-foreground mt-1">Sign in to continue to UXray.</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast("OAuth is mocked in this demo")}
        >
          <Github className="h-4 w-4 mr-2" /> GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast("OAuth is mocked in this demo")}
        >
          Google
        </Button>
      </div>
      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            nav({ to: "/app/dashboard" });
          }, 700);
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="sarah@uxray.app" required />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="pw">Password</Label>
            <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <Input id="pw" type="password" defaultValue="demo1234" required />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-primary text-primary-foreground border-0 shadow-glow"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link to="/auth/sign-up" className="text-foreground font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
