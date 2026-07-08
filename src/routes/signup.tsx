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

const roles = [
  { id: "household", label: "Household", icon: Home, desc: "Track pantry & meds" },
  { id: "business", label: "Business", icon: Building2, desc: "Restaurant / store / pharmacy" },
  { id: "ngo", label: "NGO", icon: Heart, desc: "Community kitchen / food bank" },
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Workspace administrator" },
];

function Signup() {
  const nav = useNavigate();
  const { signUp } = useAuth();
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
                    : "border-border hover:border-primary/40"
                )}
              >
                <r.icon className={cn("h-4 w-4", role === r.id ? "text-primary" : "text-muted-foreground")} />
                <div className="mt-1.5 text-sm font-medium">{r.label}</div>
                <div className="text-[11px] text-muted-foreground">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={submitting} className="w-full brand-gradient text-white hover:opacity-90">
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
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
