import { createFileRoute } from "@tanstack/react-router";
import { Users, Package, Building2, BarChart3, MoreHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sampleUsers, ngos, products } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin — ReShelf" }] }),
  component: Admin,
});

function Admin() {
  return (
    <AppShell title="Admin panel" subtitle="Workspace overview, users and operations.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total users" value={sampleUsers.length * 142} icon={Users} hint="+18% MoM" />
        <KpiCard label="Active products" value={products.length * 64} icon={Package} hint="Across all workspaces" accent="info" />
        <KpiCard label="Verified NGOs" value={ngos.length * 12} icon={Building2} hint="In 18 cities" />
        <KpiCard label="Avg. impact score" value="92 / 100" icon={BarChart3} accent="warning" />
      </div>

      <Tabs defaultValue="users" className="mt-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="ngos">NGOs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card className="border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>{["User", "Role", "Joined", "Status", ""].map(h => <th key={h} className="px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sampleUsers.map(u => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/10 text-primary text-xs">{u.name.split(" ").map(s => s[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><Badge variant="secondary">{u.role}</Badge></td>
                    <td className="px-5 py-3 text-muted-foreground">{u.joined}</td>
                    <td className="px-5 py-3">
                      <Badge className={u.status === "Active" ? "bg-success/15 text-success-foreground hover:bg-success/15" : "bg-warning/20 text-warning-foreground hover:bg-warning/20"}>{u.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right"><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <Card className="border-border/60"><CardContent className="p-6 text-sm text-muted-foreground">Global product index with moderation tools. {products.length * 64} active items across workspaces.</CardContent></Card>
        </TabsContent>
        <TabsContent value="ngos" className="mt-4">
          <Card className="border-border/60"><CardContent className="p-6 text-sm text-muted-foreground">Manage NGO verifications and onboarding. {ngos.length} verified, 7 pending.</CardContent></Card>
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <Card className="border-border/60"><CardContent className="p-6 text-sm text-muted-foreground">Export weekly and monthly impact reports as PDF or CSV.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
