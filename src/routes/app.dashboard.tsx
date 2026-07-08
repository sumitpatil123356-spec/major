import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package, AlertTriangle, HandHeart, Recycle, IndianRupee,
  Plus, Send, Bell, ArrowUpRight, Loader2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { monthlyActivity, statusOf } from "@/lib/mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ReShelf" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { products: items, loading, updateProduct } = useProducts();

  const expiring = items
    .filter((p) => statusOf(p.expiryDate) !== "safe")
    .slice(0, 5);

  const totalProducts = items.length;
  const expiringSoon = items.filter((p) => statusOf(p.expiryDate) !== "safe").length;
  const donationsMade = items.filter(p => p.donatable).length;
  const wastePrevented = `${(donationsMade * 2.4).toFixed(1)} kg`;
  const moneySaved = `₹ ${((totalProducts * 380) + (donationsMade * 420)).toLocaleString()}`;

  const handleQuickDonate = async (id, name) => {
    try {
      await updateProduct(id, { donatable: true });
      toast.success(`${name} listed on Rescue Hub!`);
    } catch (err) {
      toast.error("Failed to list product: " + err.message);
    }
  };

  return (
    <AppShell
      title={`Welcome back, ${user?.full_name || "Aisha"}`}
      subtitle="Here's what's happening on your shelf today."
      actions={
        <>
          <Button asChild variant="outline"><Link to="/app/alerts"><Bell className="mr-1.5 h-4 w-4" />View alerts</Link></Button>
          <Button asChild className="brand-gradient text-white hover:opacity-90"><Link to="/app/products"><Plus className="mr-1.5 h-4 w-4" />Add product</Link></Button>
        </>
      }
    >
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Updating metrics...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard label="Total products" value={totalProducts} hint="+4 this week" icon={Package} />
          <KpiCard label="Expiring soon" value={expiringSoon} hint="Needs attention" icon={AlertTriangle} accent="warning" />
          <KpiCard label="Donations made" value={donationsMade} hint="+12 this month" icon={HandHeart} accent="info" />
          <KpiCard label="Waste prevented" value={wastePrevented} hint="Lifetime" icon={Recycle} />
          <KpiCard label="Money saved" value={moneySaved} hint="Lifetime" icon={IndianRupee} />
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activity overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Donations vs waste, last 12 months</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/analytics">Full analytics <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={monthlyActivity}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.16 158)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="oklch(0.62 0.16 158)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 160)" />
                  <XAxis dataKey="month" stroke="oklch(0.48 0.02 160)" fontSize={12} />
                  <YAxis stroke="oklch(0.48 0.02 160)" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.93 0.008 160)" }} />
                  <Area type="monotone" dataKey="donations" stroke="oklch(0.62 0.16 158)" fill="url(#g1)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="waste" stroke="oklch(0.62 0.22 25)" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { i: Plus, t: "Add product", to: "/app/products" },
              { i: Send, t: "Donate product", to: "/app/rescue" },
              { i: Bell, t: "View alerts", to: "/app/alerts" },
            ].map((a) => (
              <Button asChild key={a.t} variant="outline" className="w-full justify-start h-12">
                <Link to={a.to}>
                  <a.i className="mr-2 h-4 w-4 text-primary" />{a.t}
                </Link>
              </Button>
            ))}
            <div className="mt-4 rounded-xl bg-primary/5 border border-primary/15 p-4">
              <div className="text-xs font-medium text-primary">Today's impact</div>
              <div className="mt-1 font-display text-2xl font-semibold">{donationsMade} donations</div>
              <div className="text-xs text-muted-foreground">Saved approx. {moneySaved} from going to waste.</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expiring soon</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app/products">View all <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {expiring.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.category} · {p.quantity} · {p.owner}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge expiry={p.expiryDate} />
                    {!p.donatable && (
                      <Button size="sm" variant="outline" onClick={() => handleQuickDonate(p.id, p.name)}>Donate</Button>
                    )}
                    {p.donatable && (
                      <Badge className="bg-primary/15 text-primary hover:bg-primary/20">Listed</Badge>
                    )}
                  </div>
                </div>
              ))}
              {expiring.length === 0 && (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">All items on your shelf are safe! 🎉</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
