import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthShell } from "./login";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify email — ReShelf" }] }),
  component: Verify,
});

function Verify() {
  return (
    <AuthShell title="Check your inbox" subtitle="We've sent a verification link to your email.">
      <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MailCheck className="h-7 w-7" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Click the link in the email to activate your account. The link expires in 30 minutes.</p>
      </div>
      <Button asChild className="mt-5 w-full brand-gradient text-white hover:opacity-90">
        <Link to="/app/dashboard">Continue to demo</Link>
      </Button>
    </AuthShell>
  );
}
