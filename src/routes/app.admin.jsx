import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Package,
  Building2,
  BarChart3,
  MoreHorizontal,
  Send,
  Zap,
  Loader2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { sampleUsers, ngos, products } from "@/lib/mock-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { sendEmailWithResend } from "../lib/api/resend.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin — ReShelf" }] }),
  component: Admin,
});

function Admin() {
  const { user } = useAuth();
  const [sendingEmail, setSendingEmail] = useState(false);

  // Rate limiter state
  const [requests, setRequests] = useState([]);
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const getRequestsLeft = () => {
    const now = Date.now();
    const activeRequests = requests.filter((time) => now - time < 60000);
    return Math.max(0, 5 - activeRequests.length);
  };

  const requestsLeft = getRequestsLeft();

  const handleRateLimitTest = () => {
    const now = Date.now();
    const activeRequests = requests.filter((time) => now - time < 60000);
    if (activeRequests.length >= 5) {
      toast.error("Too many requests! Rate limit exceeded (Max 5 clicks per minute).");
      return;
    }
    setRequests([...activeRequests, now]);
    toast.success("Request allowed! DDoS check passed.");
  };

  const handleSendTestEmail = async () => {
    const recipientEmail = user?.email || "aisha@example.com";
    setSendingEmail(true);
    try {
      const res = await sendEmailWithResend({
        to: recipientEmail,
        subject: "ReShelf - Resend Email Integration Test ✉️",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
            <h2 style="color: #10b981;">Email Integration Test Succeeded!</h2>
            <p>Hello,</p>
            <p>This is a test email sent from the ReShelf Admin panel to verify your Resend integration.</p>
            <p>Your API key is configured and working correctly.</p>
            <br/>
            <p>Best regards,</p>
            <p>The ReShelf Team</p>
          </div>
        `,
      });
      if (res.mock) {
        toast.info("Mock email sent. Check console for email body.");
      } else {
        toast.success(`Real email sent successfully to ${recipientEmail}!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Email sending failed: " + err.message);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <AppShell title="Admin panel" subtitle="Workspace overview, users and operations.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total users"
          value={sampleUsers.length * 142}
          icon={Users}
          hint="+18% MoM"
        />
        <KpiCard
          label="Active products"
          value={products.length * 64}
          icon={Package}
          hint="Across all workspaces"
          accent="info"
        />
        <KpiCard
          label="Verified NGOs"
          value={ngos.length * 12}
          icon={Building2}
          hint="In 18 cities"
        />
        <KpiCard label="Avg. impact score" value="92 / 100" icon={BarChart3} accent="warning" />
      </div>

      <Tabs defaultValue="users" className="mt-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="ngos">NGOs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="dev-tools">Dev Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card className="border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  {["User", "Role", "Joined", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sampleUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {u.name
                              .split(" ")
                              .map((s) => s[0])
                              .slice(0, 2)
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary">{u.role}</Badge>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{u.joined}</td>
                    <td className="px-5 py-3">
                      <Badge
                        className={
                          u.status === "Active"
                            ? "bg-success/15 text-success-foreground hover:bg-success/15"
                            : "bg-warning/20 text-warning-foreground hover:bg-warning/20"
                        }
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <Card className="border-border/60">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Global product index with moderation tools. {products.length * 64} active items across
              workspaces.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ngos" className="mt-4">
          <Card className="border-border/60">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Manage NGO verifications and onboarding. {ngos.length} verified, 7 pending.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          <Card className="border-border/60">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Export weekly and monthly impact reports as PDF or CSV.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dev-tools" className="mt-4 space-y-4 max-w-2xl">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-display text-base font-semibold">Email Integration Test</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Test the Resend email integration. Requires RESEND_API_KEY in .env. Used for
                  budget alert emails.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-sm border-border hover:bg-muted/50"
                onClick={handleSendTestEmail}
                disabled={sendingEmail}
              >
                {sendingEmail ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Send className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{sendingEmail ? "Sending..." : "Send Test Email"}</span>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-semibold">
                    Arcjet Rate Limiting Test
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Test Arcjet-style rate limiting. Max 5 clicks per minute. Simulates DDoS
                    protection.
                  </p>
                </div>
                <Badge
                  className={cn(
                    "text-xs transition-colors shrink-0",
                    requestsLeft === 0
                      ? "bg-destructive/15 text-destructive-foreground hover:bg-destructive/15 border-transparent shadow-none"
                      : requestsLeft <= 2
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15 border-transparent shadow-none"
                        : "bg-success/15 text-success-foreground hover:bg-success/15 border-transparent shadow-none",
                  )}
                >
                  {requestsLeft}/5 requests left
                </Badge>
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-sm border-border hover:bg-muted/50"
                onClick={handleRateLimitTest}
              >
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span>Test Rate Limit</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
