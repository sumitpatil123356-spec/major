import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { monthlyActivity, savingsTrend, statusOf } from "@/lib/mock-data";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { useProducts } from "../hooks/useProducts";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — ReShelf" }] }),
  component: Analytics,
});

const colors = ["oklch(0.62 0.16 158)", "oklch(0.72 0.14 195)", "oklch(0.78 0.16 75)", "oklch(0.62 0.22 25)"];

function Analytics() {
  const { products: items, loading } = useProducts();

  // Calculate dynamic category breakdown
  const categoryCounts = items.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const dynamicCategoryBreakdown = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  // Fallback to static breakdown if no items
  const activeCategoryBreakdown = dynamicCategoryBreakdown.length > 0 
    ? dynamicCategoryBreakdown 
    : [
        { name: "Food", value: 58 },
        { name: "Medicine", value: 22 },
        { name: "Cosmetics", value: 12 },
        { name: "Household", value: 8 },
      ];

  // Calculate dynamic monthly contribution based on current user items
  const dynamicMonthlyActivity = monthlyActivity.map((act, index) => {
    // Add small variance based on user's products to show they affect the chart
    const userDonations = items.filter(p => p.donatable).length;
    const factor = Math.min(userDonations, 5);
    return {
      ...act,
      donations: act.donations + (index === 11 ? factor : Math.round(factor * (index / 12))),
    };
  });

  return (
    <AppShell title="Analytics" subtitle="A deep look at waste, donations and savings.">
      {loading ? (
        <div className="flex h-72 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing shelf data...</p>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border/60">
            <CardHeader><CardTitle>Donations by month</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={dynamicMonthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 160)" />
                    <XAxis dataKey="month" stroke="oklch(0.48 0.02 160)" fontSize={12} />
                    <YAxis stroke="oklch(0.48 0.02 160)" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.93 0.008 160)" }} />
                    <Bar dataKey="donations" fill="oklch(0.62 0.16 158)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader><CardTitle>Money saved (₹)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={savingsTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 160)" />
                    <XAxis dataKey="month" stroke="oklch(0.48 0.02 160)" fontSize={12} />
                    <YAxis stroke="oklch(0.48 0.02 160)" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.93 0.008 160)" }} />
                    <Line type="monotone" dataKey="saved" stroke="oklch(0.62 0.16 158)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader><CardTitle>Category breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={activeCategoryBreakdown} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={3}>
                      {activeCategoryBreakdown.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.93 0.008 160)" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader><CardTitle>Waste vs donations</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={dynamicMonthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 160)" />
                    <XAxis dataKey="month" stroke="oklch(0.48 0.02 160)" fontSize={12} />
                    <YAxis stroke="oklch(0.48 0.02 160)" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.93 0.008 160)" }} />
                    <Legend />
                    <Bar dataKey="donations" stackId="a" fill="oklch(0.62 0.16 158)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="waste" stackId="a" fill="oklch(0.62 0.22 25)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
