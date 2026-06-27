import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({
    meta: [
      { title: "Sign up — UXray" },
      { name: "description", content: "Create your UXray workspace." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pw, setPw] = useState("");
  const rules = [
    { ok: pw.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Z]/.test(pw), label: "One uppercase letter" },
    { ok: /\d/.test(pw), label: "One number" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="text-sm text-muted-foreground mt-1">Free forever. No credit card.</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => toast("OAuth is mocked")}>
          <Github className="h-4 w-4 mr-2" /> GitHub
        </Button>
        <Button variant="outline" onClick={() => toast("OAuth is mocked")}>
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
          }, 800);
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="first">First name</Label>
            <Input id="first" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last">Last name</Label>
            <Input id="last" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw">Password</Label>
          <Input
            id="pw"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
        </div>
        {pw && (
          <ul className="space-y-1">
            {rules.map((r) => (
              <li key={r.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check
                  className={`h-3 w-3 ${r.ok ? "text-success" : "text-muted-foreground/40"}`}
                />{" "}
                {r.label}
              </li>
            ))}
          </ul>
        )}
        <Button
          type="submit"
          className="w-full bg-gradient-primary text-primary-foreground border-0 shadow-glow"
          disabled={loading}
        >
          {loading ? "Creating workspace…" : "Create account"}
        </Button>
        <p className="text-[11px] text-muted-foreground text-center">
          By signing up you agree to our <a className="underline">Terms</a> and{" "}
          <a className="underline">Privacy</a>.
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/sign-in" className="text-foreground font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
