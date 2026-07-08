import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Star, Calendar, Truck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ngos } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/ngos")({
  head: () => ({ meta: [{ title: "NGO Directory — ReShelf" }] }),
  component: Directory,
});

function Directory() {
  return (
    <AppShell title="NGO directory" subtitle="Verified partners ready to receive your surplus.">
      <div className="grid md:grid-cols-2 gap-5">
        {ngos.map((n) => (
          <Card key={n.id} className="hover-lift border-border/60">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl brand-gradient text-white font-display font-semibold text-lg">
                  {n.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{n.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {n.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {n.location}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {n.categories.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {n.phone}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {n.email}</div>
                <div className="col-span-2 flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> {n.pickup}</div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button className="flex-1 brand-gradient text-white hover:opacity-90" onClick={() => toast.success(`Pickup requested from ${n.name}`)}>
                  <Truck className="mr-1.5 h-4 w-4" /> Request pickup
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => toast(`Donation scheduled with ${n.name}`)}>
                  <Calendar className="mr-1.5 h-4 w-4" /> Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
