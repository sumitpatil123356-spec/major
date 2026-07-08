import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Leaf, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — ReShelf" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("aisha@example.com");
  const [password, setPassword] = useState("demo1234");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await signIn(email, password);
      nav({ to: "/app/dashboard" });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your shelf.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@company.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-full brand-gradient text-white hover:opacity-90">
          {submitting ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            <>
              Sign in <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New here? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 brand-gradient text-white relative overflow-hidden">
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-semibold">ReShelf</span>
        </Link>
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight">Nothing useful should go to waste.</h2>
          <p className="mt-3 text-white/85">Trusted by households, restaurants, pharmacies and NGOs to track expiry and redistribute surplus.</p>
        </div>
        <div className="relative text-xs text-white/75">© 2026 ReShelf</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/60 shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg brand-gradient">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <span className="font-display font-semibold">ReShelf</span>
              </Link>
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
