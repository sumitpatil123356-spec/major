import { cn } from "@/lib/utils";
import { statusOf, daysRemaining } from "@/lib/mock-data";

export function StatusBadge({ expiry, className }: { expiry: string; className?: string }) {
  const s = statusOf(expiry);
  const d = daysRemaining(expiry);
  const map = {
    safe: { label: `${d}d left`, cls: "bg-success/15 text-success-foreground ring-success/30" },
    warning: { label: `${d}d left`, cls: "bg-warning/20 text-warning-foreground ring-warning/40" },
    critical: { label: d <= 0 ? "Expired" : `${d}d left`, cls: "bg-critical/15 text-critical ring-critical/30" },
  }[s];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1", map.cls, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        s === "safe" && "bg-success",
        s === "warning" && "bg-warning",
        s === "critical" && "bg-critical")} />
      {map.label}
    </span>
  );
}
