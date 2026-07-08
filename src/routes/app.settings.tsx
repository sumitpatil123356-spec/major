import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — ReShelf" }] }),
  component: Settings,
});

function Settings() {
  return (
    <AppShell title="Settings" subtitle="Manage your profile, notifications and security.">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-primary/20"><AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">AK</AvatarFallback></Avatar>
              <div>
                <Button variant="outline" size="sm">Change avatar</Button>
                <div className="mt-1 text-xs text-muted-foreground">PNG or JPG, up to 2MB.</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue="Aisha Khan" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" defaultValue="aisha@example.com" /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+91 98000 11223" /></div>
              <div className="space-y-1.5"><Label>City</Label><Input defaultValue="Bengaluru" /></div>
            </div>
            <div className="mt-5"><Button className="brand-gradient text-white hover:opacity-90" onClick={() => toast.success("Profile updated")}>Save changes</Button></div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { t: "Expiry warnings", d: "30, 7 and 1 day before expiry", on: true },
              { t: "Donation suggestions", d: "When items are ready to share", on: true },
              { t: "NGO updates", d: "Pickup confirmations & changes", on: true },
              { t: "Weekly digest", d: "Sunday impact summary", on: false },
            ].map((n) => (
              <div key={n.t} className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-sm">{n.t}</div>
                  <div className="text-xs text-muted-foreground">{n.d}</div>
                </div>
                <Switch defaultChecked={n.on} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle>Donation preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Preferred NGO</Label><Input defaultValue="Helping Hands" /></div>
            <div className="space-y-1.5"><Label>Pickup window</Label><Input defaultValue="Weekends, 10am – 2pm" /></div>
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-medium">Auto-list expiring items</div><div className="text-xs text-muted-foreground">Add to Rescue Hub at T-7 days</div></div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/60">
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Current password</Label><Input type="password" /></div>
              <div className="space-y-1.5"><Label>New password</Label><Input type="password" /></div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><div className="text-sm font-medium">Two-factor authentication</div><div className="text-xs text-muted-foreground">Add a second layer of security to your account.</div></div>
              <Switch />
            </div>
            <div><Button variant="outline" onClick={() => toast.success("Password updated")}>Update password</Button></div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
