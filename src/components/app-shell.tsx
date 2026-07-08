import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Bell, HandHeart, Building2, BarChart3,
  Globe2, ShieldCheck, Settings, Leaf, Menu, Search, Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/products", label: "Products", icon: Package },
  { to: "/app/alerts", label: "Smart Alerts", icon: Bell },
  { to: "/app/rescue", label: "Rescue Hub", icon: HandHeart },
  { to: "/app/ngos", label: "NGO Directory", icon: Building2 },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/impact", label: "Community Impact", icon: Globe2 },
  { to: "/app/admin", label: "Admin", icon: ShieldCheck },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children, title, subtitle, actions }: {
  children: ReactNode; title: string; subtitle?: string; actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-[var(--gradient-soft)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="grid h-9 w-9 place-items-center rounded-xl brand-gradient shadow-[var(--shadow-glow)]">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold tracking-tight">ReShelf</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">Track · Share · Reduce</div>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-primary")} />
                {label}
                {label === "Smart Alerts" && (
                  <Badge className="ml-auto h-5 bg-critical/15 text-critical hover:bg-critical/15">3</Badge>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-sidebar-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI Roadmap
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Receipt scanning & smart donation matching coming soon.
          </p>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 glass border-b border-border">
          <div className="flex h-16 items-center gap-3 px-4 md:px-8">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden md:block w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9 bg-muted/40 border-transparent focus-visible:bg-card" placeholder="Search products, NGOs…" />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-critical" />
              </Button>
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">AK</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 animate-float-up">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
          <div className="animate-float-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
