import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, ScanLine, CheckCircle2, RefreshCw, X, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { barcodeDatabase } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { GroqScanner } from "./GroqScanner";

const categories = ["Food", "Medicine", "Cosmetics", "Household"];

export function ScanProductDialog({ open, onOpenChange, onAdd }) {
  const [scanType, setScanType] = useState("barcode");
  const [stage, setStage] = useState("idle");
  const [match, setMatch] = useState(null);
  const [quantity, setQuantity] = useState("1 unit");
  const [expiry, setExpiry] = useState("");
  const [category, setCategory] = useState("Food");
  const timers = useRef([]);

  useEffect(() => {
    if (!open) reset();
    return () => timers.current.forEach(clearTimeout);
  }, [open]);

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage("idle");
    setMatch(null);
    setExpiry("");
    setQuantity("1 unit");
  }

  function startScan() {
    setStage("scanning");
    const t = window.setTimeout(() => {
      const picked = barcodeDatabase[Math.floor(Math.random() * barcodeDatabase.length)];
      const d = new Date();
      d.setDate(d.getDate() + picked.defaultShelfLifeDays);
      setMatch(picked);
      setCategory(picked.category);
      setQuantity(picked.packageSize);
      setExpiry(d.toISOString().slice(0, 10));
      setStage("detected");
    }, 2200);
    timers.current.push(t);
  }

  function confirmAdd() {
    if (!match) return;
    onAdd({
      id: crypto.randomUUID(),
      name: match.name,
      category,
      quantity,
      purchaseDate: new Date().toISOString().slice(0, 10),
      expiryDate: expiry,
      owner: "Aisha Khan",
      notes: `Scanned · Barcode ${match.barcode} · ${match.brand}`,
      donatable: false,
    });
    toast.success(`${match.name} added to inventory`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-primary" /> Scan product
          </DialogTitle>
          <DialogDescription>
            Choose a scan method to auto-fill details from packing/receipts.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Controls */}
        <div className="flex border-b border-border mb-2 mt-2">
          <button
            onClick={() => setScanType("barcode")}
            className={cn(
              "flex-1 pb-2 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-1.5",
              scanType === "barcode"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Camera className="h-4 w-4" /> Faux Barcode Scan
          </button>
          <button
            onClick={() => setScanType("vision")}
            className={cn(
              "flex-1 pb-2 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-1.5",
              scanType === "vision"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Sparkles className="h-4 w-4" /> AI Vision Scan
          </button>
        </div>

        {scanType === "vision" ? (
          <GroqScanner onAdd={onAdd} onClose={() => onOpenChange(false)} />
        ) : (
          <>
            {stage !== "detected" && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* faux camera viewfinder */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.25),transparent_60%)]" />
                <div className="absolute inset-8 rounded-xl border-2 border-white/30">
                  <span className="absolute -top-0.5 -left-0.5 h-6 w-6 border-t-2 border-l-2 border-primary rounded-tl-xl" />
                  <span className="absolute -top-0.5 -right-0.5 h-6 w-6 border-t-2 border-r-2 border-primary rounded-tr-xl" />
                  <span className="absolute -bottom-0.5 -left-0.5 h-6 w-6 border-b-2 border-l-2 border-primary rounded-bl-xl" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-6 w-6 border-b-2 border-r-2 border-primary rounded-br-xl" />
                  {stage === "scanning" && (
                    <div className="absolute inset-x-2 top-1/2 h-0.5 bg-primary shadow-[0_0_12px_2px_rgba(16,185,129,0.7)] animate-[scan_1.6s_ease-in-out_infinite]" />
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                  {stage === "idle" && (
                    <Button
                      onClick={startScan}
                      className="brand-gradient text-white hover:opacity-90"
                    >
                      <Camera className="mr-1.5 h-4 w-4" /> Start camera
                    </Button>
                  )}
                  {stage === "scanning" && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur px-4 py-1.5 text-xs font-medium text-white">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Scanning barcode…
                    </div>
                  )}
                </div>
                <style>{`@keyframes scan{0%,100%{transform:translateY(-60px)}50%{transform:translateY(60px)}}`}</style>
              </div>
            )}

            {stage === "detected" && match && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="h-4 w-4" /> Product detected
                  <Badge variant="secondary" className="ml-auto font-mono text-[10px]">
                    {match.barcode}
                  </Badge>
                </div>

                <div className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="h-24 w-24 rounded-xl object-cover ring-1 ring-border"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg font-semibold leading-tight">
                      {match.name}
                    </div>
                    <div className="mt-0.5 text-sm text-muted-foreground">{match.brand}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{match.category}</Badge>
                      <Badge variant="outline">{match.packageSize}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Quantity</Label>
                    <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Expiry date</Label>
                    <Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2 mt-4">
              {stage === "detected" ? (
                <>
                  <Button variant="outline" onClick={reset}>
                    <RefreshCw className="mr-1.5 h-4 w-4" /> Scan again
                  </Button>
                  <Button
                    onClick={confirmAdd}
                    className="brand-gradient text-white hover:opacity-90"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Add to inventory
                  </Button>
                </>
              ) : (
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  <X className="mr-1.5 h-4 w-4" /> Cancel
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
