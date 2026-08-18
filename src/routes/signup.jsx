import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Home, Building2, Heart, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AuthShell } from "./login";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { isSupabaseConfigured } from "../lib/supabase";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — ReShelf" }] }),
  component: Signup,
});

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const roles = [
  { id: "household", label: "Household", icon: Home, desc: "Track pantry & meds" },
  { id: "business", label: "Business", icon: Building2, desc: "Restaurant / store / pharmacy" },
  { id: "ngo", label: "NGO", icon: Heart, desc: "Community kitchen / food bank" },
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Workspace administrator" },
];

function Signup() {
  const nav = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("household");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setSubmitting(true);
    try {
      await signUp(email, password, {
        full_name: name,
        role: role,
        city: "Bengaluru",
      });
      if (isSupabaseConfigured) {
        nav({ to: "/verify-email" });
      } else {
        nav({ to: "/app/dashboard" });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start saving in under a minute.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5 col-span-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Aisha Khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>I am a…</Label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-all",
                  role === r.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40",
                )}
              >
                <r.icon
                  className={cn(
                    "h-4 w-4",
                    role === r.id ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <div className="mt-1.5 text-sm font-medium">{r.label}</div>
                <div className="text-[11px] text-muted-foreground">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full brand-gradient text-white hover:opacity-90"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Creating account...
            </>
          ) : (
            <>
              Create account <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={async () => {
            try {
              await signInWithGoogle();
              nav({ to: "/app/dashboard" });
            } catch (err) {
              toast.error("Google sign up failed");
            }
          }}
        >
          <GoogleIcon /> Google
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
