import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf, ArrowRight, Bell, HandHeart, BarChart3, Building2, Sparkles,
  ShieldCheck, Check, Star, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReShelf — Nothing useful should go to waste." },
      { name: "description", content: "Track products, receive expiry alerts, and donate surplus before it becomes waste. Built for households, restaurants, pharmacies and communities." },
      { property: "og:title", content: "ReShelf — Nothing useful should go to waste." },
      { property: "og:description", content: "Track products, receive expiry alerts, and donate surplus before it becomes waste." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 glass border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl brand-gradient">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">ReShelf</span>
          </Link>
          <nav className="ml-10 hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#impact" className="hover:text-foreground transition-colors">Impact</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost"><Link to="/login">Sign in</Link></Button>
            <Button asChild className="brand-gradient text-white hover:opacity-90 shadow-sm">
              <Link to="/signup">Get started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,oklch(0.95_0.04_158/.6),transparent_60%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 text-center">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            <Sparkles className="mr-1.5 h-3 w-3 text-primary" /> Backed by waste-reduction science
          </Badge>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            Nothing useful should <br />
            <span className="text-brand-gradient">go to waste.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Track products, receive expiry alerts, and donate surplus before it becomes waste —
            for households, restaurants, pharmacies and communities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="brand-gradient text-white hover:opacity-90 shadow-[var(--shadow-glow)]">
              <Link to="/signup">Get started — free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-card">
              <Link to="/app/dashboard">View demo</Link>
            </Button>
          </div>
          <div className="mt-14 mx-auto max-w-5xl">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { stat: "1.3 B", label: "tonnes of food wasted globally every year" },
            { stat: "₹ 92,000 cr", label: "of medicine expires unused in India alone" },
            { stat: "1 in 9", label: "people go to bed hungry while shelves overflow" },
          ].map((p) => (
            <Card key={p.label} className="border-border/60">
              <CardContent className="p-8">
                <div className="font-display text-4xl font-semibold text-brand-gradient">{p.stat}</div>
                <div className="mt-2 text-sm text-muted-foreground">{p.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle eyebrow="How it works" title="Three steps to zero waste." />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Add your products", d: "Log items by hand or scan receipts. Categorize as food, medicine, cosmetics or household." },
            { n: "02", t: "Get smart alerts", d: "We watch the calendar so you don't have to. Warnings 30, 7 and 1 day before expiry." },
            { n: "03", t: "Share the surplus", d: "Match with verified NGOs and community kitchens nearby. Schedule a pickup in a tap." },
          ].map((s) => (
            <Card key={s.n} className="hover-lift border-border/60">
              <CardContent className="p-8">
                <div className="text-xs font-semibold tracking-widest text-primary">{s.n}</div>
                <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[var(--gradient-soft)] border-y border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionTitle eyebrow="Features" title="A modern operating system for surplus." />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { i: Bell, t: "Smart expiry alerts", d: "Tiered warnings at 30, 7 and 1 day with priority routing." },
              { i: HandHeart, t: "Rescue Hub", d: "A live marketplace of donatable items with one-tap requests." },
              { i: Building2, t: "NGO directory", d: "Verified partners with pickup windows and category fit." },
              { i: BarChart3, t: "Impact analytics", d: "Track waste prevented, money saved and donations completed." },
              { i: ShieldCheck, t: "Role-based access", d: "Tailored flows for households, businesses, NGOs and admins." },
              { i: Sparkles, t: "AI roadmap", d: "Receipt scanning, expiry prediction and smart donation matching." },
            ].map((f) => (
              <Card key={f.t} className="hover-lift border-border/60">
                <CardContent className="p-7">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <f.i className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{f.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle eyebrow="Impact metrics" title="Numbers that grow with you." />
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { v: "342 kg", l: "Waste prevented" },
            { v: "8,420", l: "Donations completed" },
            { v: "21,300", l: "Meals saved" },
            { v: "₹2.6 L", l: "Money saved" },
          ].map((s) => (
            <Card key={s.l} className="border-border/60">
              <CardContent className="p-8 text-center">
                <div className="font-display text-4xl font-semibold text-brand-gradient">{s.v}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[var(--gradient-soft)] border-y border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionTitle eyebrow="Loved by teams" title="Stories from our community." />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { q: "We cut weekly waste by 38% in our first month. The alerts are honestly life-changing.", n: "Priya Menon", r: "Owner, Sunrise Cafe" },
              { q: "ReShelf made our donation workflow ridiculously simple. The NGO matching is brilliant.", n: "Arjun Rao", r: "Manager, GreenMart" },
              { q: "Our pharmacy now redirects soon-to-expire stock to clinics — zero loss, real impact.", n: "Dr. Neha Iyer", r: "MediCare Pharmacy" },
            ].map((t) => (
              <Card key={t.n} className="border-border/60">
                <CardContent className="p-7">
                  <div className="flex gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed">"{t.q}"</p>
                  <div className="mt-5 text-sm font-medium">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <SectionTitle eyebrow="Pricing" title="Simple plans for every kitchen." />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { p: "Free", price: "₹0", desc: "For households starting out.", f: ["Up to 50 products", "Smart expiry alerts", "NGO directory access"] },
            { p: "Business", price: "₹999", desc: "Restaurants & grocery stores.", f: ["Unlimited products", "Bulk upload", "Pickup scheduling", "Analytics dashboard"], featured: true },
            { p: "Enterprise", price: "Custom", desc: "Chains, pharma & NGOs.", f: ["SSO & role management", "API access", "Dedicated success", "Custom reporting"] },
          ].map((tier) => (
            <Card key={tier.p} className={`border-border/60 ${tier.featured ? "ring-2 ring-primary shadow-[var(--shadow-glow)]" : ""}`}>
              <CardContent className="p-8">
                {tier.featured && <Badge className="mb-3 bg-primary/15 text-primary hover:bg-primary/15">Most popular</Badge>}
                <h3 className="font-display text-xl font-semibold">{tier.p}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-sm text-muted-foreground">/mo</span>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{tier.desc}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {tier.f.map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" /> {x}
                    </li>
                  ))}
                </ul>
                <Button asChild className={`mt-7 w-full ${tier.featured ? "brand-gradient text-white hover:opacity-90" : ""}`} variant={tier.featured ? "default" : "outline"}>
                  <Link to="/signup">Start with {tier.p}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <SectionTitle eyebrow="FAQ" title="Questions, answered." />
        <Accordion type="single" collapsible className="mt-10">
          {[
            { q: "How does ReShelf know when something is expiring?", a: "You log purchase + expiry dates manually or via receipt import. We notify you 30, 7 and 1 day before expiry." },
            { q: "Which NGOs do you work with?", a: "We partner with verified food banks, community kitchens and care foundations across major cities — and we keep adding more." },
            { q: "Can businesses bulk-upload inventory?", a: "Yes. Business and Enterprise plans support CSV upload, inventory sync and scheduled donation pickups." },
            { q: "Is ReShelf free for households?", a: "Yes — the Free tier covers up to 50 active products with all core features." },
          ].map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <Card className="overflow-hidden border-0 brand-gradient text-white shadow-[var(--shadow-glow)]">
          <CardContent className="p-12 md:p-16 text-center">
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Start saving today.</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">Join thousands of households and businesses redirecting surplus to those who need it.</p>
            <Button asChild size="lg" className="mt-7 bg-white text-primary hover:bg-white/90">
              <Link to="/signup">Create your free account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg brand-gradient">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-semibold">ReShelf</span>
            </div>
            <p className="mt-3 text-muted-foreground text-xs leading-relaxed">Track Expiry. Share Surplus. Reduce Waste.</p>
          </div>
          {[
            { h: "Product", l: ["Features", "Pricing", "Roadmap", "Changelog"] },
            { h: "Company", l: ["About", "Careers", "Press", "Contact"] },
            { h: "Resources", l: ["Help center", "Blog", "Partners", "Status"] },
          ].map((c) => (
            <div key={c.h}>
              <div className="font-medium">{c.h}</div>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {c.l.map((x) => <li key={x}><a className="hover:text-foreground" href="#">{x}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
          © 2026 ReShelf. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-semibold tracking-widest uppercase text-primary">{eyebrow}</div>
      <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-3xl border border-border/60 bg-card shadow-2xl shadow-primary/10 overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/30 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-critical/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <span className="ml-3 text-xs text-muted-foreground">reshelf.app/dashboard</span>
      </div>
      <div className="grid md:grid-cols-4 gap-3 p-5">
        {[
          { k: "Products", v: "248", c: "bg-primary/10" },
          { k: "Expiring", v: "12", c: "bg-warning/15" },
          { k: "Donations", v: "128", c: "bg-chart-2/15" },
          { k: "Saved", v: "₹2.6L", c: "bg-primary/10" },
        ].map((x) => (
          <div key={x.k} className={`rounded-2xl ${x.c} p-4`}>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{x.k}</div>
            <div className="mt-1 font-display text-2xl font-semibold">{x.v}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-3 px-5 pb-5">
        <div className="md:col-span-2 h-44 rounded-2xl bg-gradient-to-br from-primary/10 to-chart-2/10 grid place-items-center text-xs text-muted-foreground">
          Monthly donations trend
        </div>
        <div className="h-44 rounded-2xl bg-gradient-to-br from-warning/15 to-critical/10 grid place-items-center text-xs text-muted-foreground">
          Category breakdown
        </div>
      </div>
    </div>
  );
}
