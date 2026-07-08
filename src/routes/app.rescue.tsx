import { createFileRoute } from "@tanstack/react-router";
import { HandHeart, MapPin, MessageSquare, Send, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { sendEmailWithResend } from "../lib/api/resend.functions";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/app/rescue")({
  head: () => ({ meta: [{ title: "Rescue Hub — ReShelf" }] }),
  component: Rescue,
});

function Rescue() {
  const { user } = useAuth();
  const { products: items, loading, updateProduct } = useProducts();
  const [requestingId, setRequestingId] = useState(null);

  const donatableItems = items.filter((p) => p.donatable);

  const handleRequest = async (product) => {
    if (!user) return;
    setRequestingId(product.id);
    try {
      // 1. Trigger email notification to product owner via Resend
      await sendEmailWithResend({
        to: user.email, // In a real app this would go to product.owner's email; using logged-in user for demonstration so they receive the email!
        subject: `🔔 ReShelf Request: ${product.name}`,
        html: `
          <h3>Good news! Your product has been requested.</h3>
          <p><strong>Item:</strong> ${product.name}</p>
          <p><strong>Quantity:</strong> ${product.quantity}</p>
          <p><strong>Requested By:</strong> ${user.full_name} (${user.email})</p>
          <p>Please coordinate with the recipient to arrange pickup/delivery.</p>
          <br/>
          <p>Thank you for reducing waste! 🌱</p>
          <p>The ReShelf Team</p>
        `
      });

      // 2. Mark product as requested / no longer donatable since it's reserved
      await updateProduct(product.id, { donatable: false, notes: `${product.notes || ""} (Requested by ${user.full_name})` });

      toast.success(`Request sent! Confirmation email triggered for ${product.name}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request: " + err.message);
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <AppShell title="Rescue Hub" subtitle="Products available for donation in your community.">
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-border/60 bg-card">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading rescue hub items...</p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {donatableItems.map((p) => (
            <Card key={p.id} className="hover-lift border-border/60 overflow-hidden">
              <div className="h-32 brand-gradient relative">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/15" />
                <div className="absolute top-3 right-3">
                  <StatusBadge expiry={p.expiryDate} />
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="text-xs uppercase tracking-wide opacity-80">{p.category}</div>
                  <div className="font-display text-lg font-semibold leading-tight">{p.name}</div>
                </div>
              </div>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{p.quantity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Donor</span>
                  <span className="font-medium">{p.owner}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Nearby · within 4 km
                </div>
                <div className="flex gap-2 pt-1">
                  <Button 
                    size="sm" 
                    className="flex-1 brand-gradient text-white hover:opacity-90"
                    disabled={requestingId === p.id}
                    onClick={() => handleRequest(p)}
                  >
                    {requestingId === p.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <HandHeart className="mr-1 h-4 w-4" /> Request
                      </>
                    )}
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => toast(`Messaging option with ${p.owner} coming soon`)}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {donatableItems.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-border bg-card/50">
              <HandHeart className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
              <h3 className="font-semibold text-lg">Rescue Hub is empty</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">There are currently no items listed for donation. Try adding a product and marking it as donatable!</p>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
