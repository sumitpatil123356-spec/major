import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ScanLine, Brain, Network, LineChart } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { communityImpact } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/impact")({
  head: () => ({ meta: [{ title: "Community Impact — ReShelf" }] }),
  component: Impact,
});

function useCounter(target, dur = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * ease));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return n.toLocaleString();
}

function Impact() {
  const a = useCounter(communityImpact.totalDonations);
  const b = useCounter(communityImpact.mealsSaved);
  const c = useCounter(communityImpact.productsRedistributed);
  const d = useCounter(communityImpact.impactScore);
  return (
    <AppShell title="Community impact" subtitle="The collective force of every ReShelf action.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { l: "Total donations", v: a },
          { l: "Meals saved", v: b },
          { l: "Products redistributed", v: c },
          { l: "Impact score", v: d, suffix: " / 100" },
        ].map((s) => (
          <Card key={s.l} className="border-border/60">
            <CardContent className="p-7 text-center">
              <div className="font-display text-5xl font-semibold text-brand-gradient tabular-nums">
                {s.v}
                {s.suffix ?? ""}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-0 brand-gradient text-white overflow-hidden shadow-[var(--shadow-glow)]">
        <CardContent className="p-10 md:p-14">
          <Badge className="bg-white/20 text-white hover:bg-white/20">
            <Sparkles className="mr-1 h-3 w-3" /> Coming soon
          </Badge>
          <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold tracking-tight">
            AI features on our roadmap
          </h2>
          <p className="mt-2 text-white/85 max-w-xl">
            Smarter shelves, less waste. Here's what's next.
          </p>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {[
              {
                i: ScanLine,
                t: "AI receipt scanner",
                d: "Auto-add products from a photo of your receipt.",
              },
              {
                i: Brain,
                t: "Expiry prediction",
                d: "Predict shelf life based on storage and brand history.",
              },
              {
                i: Network,
                t: "Smart donation matching",
                d: "Match surplus to NGOs by category, distance and urgency.",
              },
              {
                i: LineChart,
                t: "Predictive waste analytics",
                d: "Forecast next month's waste and prevent it early.",
              },
            ].map((f) => (
              <div
                key={f.t}
                className="rounded-2xl bg-white/10 backdrop-blur p-5 border border-white/15"
              >
                <f.i className="h-5 w-5" />
                <div className="mt-3 font-semibold">{f.t}</div>
                <div className="text-sm text-white/80">{f.d}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
