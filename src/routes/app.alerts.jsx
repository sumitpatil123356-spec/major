import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Bell, HandHeart, Clock } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { products, statusOf, daysRemaining } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/alerts")({
  head: () => ({ meta: [{ title: "Smart Alerts — ReShelf" }] }),
  component: Alerts,
});

function Alerts() {
  const items = products
    .filter((p) => statusOf(p.expiryDate) !== "safe")
    .map((p) => ({ ...p, d: daysRemaining(p.expiryDate), s: statusOf(p.expiryDate) }))
    .sort((a, b) => a.d - b.d);

  return (
    <AppShell title="Smart alerts" subtitle="Stay ahead of expiry — we'll keep watch.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            t: "Critical",
            c: "critical",
            n: items.filter((i) => i.s === "critical").length,
            d: "≤ 7 days",
          },
          {
            t: "Warning",
            c: "warning",
            n: items.filter((i) => i.s === "warning").length,
            d: "≤ 30 days",
          },
          {
            t: "Suggestions",
            c: "primary",
            n: items.filter((i) => i.donatable).length,
            d: "Ready to donate",
          },
        ].map((s) => (
          <Card key={s.t} className="border-border/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-xl",
                  s.c === "critical" && "bg-critical/15 text-critical",
                  s.c === "warning" && "bg-warning/20 text-warning-foreground",
                  s.c === "primary" && "bg-primary/10 text-primary",
                )}
              >
                {s.c === "primary" ? (
                  <HandHeart className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.t}</div>
                <div className="font-display text-2xl font-semibold">{s.n}</div>
                <div className="text-xs text-muted-foreground">{s.d}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-border/60">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {items.map((i) => (
              <div
                key={i.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    i.s === "critical"
                      ? "bg-critical/15 text-critical"
                      : "bg-warning/20 text-warning-foreground",
                  )}
                >
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {i.category} · {i.quantity} · {i.owner}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {i.d <= 0 ? "Expired" : `${i.d} day${i.d === 1 ? "" : "s"} left`}
                </div>
                <Button
                  size="sm"
                  variant={i.s === "critical" ? "default" : "outline"}
                  className={i.s === "critical" ? "brand-gradient text-white hover:opacity-90" : ""}
                >
                  {i.donatable ? "Donate now" : "Mark used"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
