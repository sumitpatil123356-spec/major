import React, { useState } from "react";
import { Upload, Sparkles, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { scanProductWithGroq } from "../lib/api/groq.functions";
import { toast } from "sonner";

export function GroqScanner({ onAdd, onClose }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [status, setStatus] = useState("idle"); // idle, reading, scanning, detected
  const [scanResult, setScanResult] = useState(null);

  // Form states for confirmation
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [quantity, setQuantity] = useState("1 unit");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("reading");
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
      setStatus("idle");
    };
    reader.onerror = () => {
      toast.error("Failed to read image file.");
      setStatus("idle");
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!imageBase64) return;
    setStatus("scanning");

    try {
      const result = await scanProductWithGroq({ imageBase64 });
      setScanResult(result);
      setName(result.name);
      setCategory(result.category);
      setQuantity(result.quantity);
      setExpiryDate(result.expiryDate);
      setNotes(result.notes);
      setStatus("detected");
      toast.success("Product analyzed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("AI scanning failed: " + err.message);
      setStatus("idle");
    }
  };

  const handleConfirm = () => {
    if (!name || !expiryDate) {
      toast.error("Please fill in the product name and expiry date.");
      return;
    }

    onAdd({
      name,
      category,
      quantity,
      purchaseDate: new Date().toISOString().slice(0, 10),
      expiryDate,
      notes: notes + " (Groq AI Vision Scanned)",
      donatable: false,
    });

    onClose();
  };

  return (
    <div className="space-y-4">
      {status === "scanning" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center border border-border rounded-2xl bg-card">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="space-y-1">
            <h4 className="font-semibold text-base flex items-center gap-1.5 justify-center">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Groq AI Vision Active
            </h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Reading product text, predicting categories, and estimating expiry dates...
            </p>
          </div>
        </div>
      )}

      {(status === "idle" || status === "reading") && !imagePreview && (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-card hover:bg-muted/30 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mb-2 text-sm font-semibold">Click to upload product image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (max. 4MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
              disabled={status === "reading"} 
            />
          </label>
        </div>
      )}

      {imagePreview && status !== "scanning" && status !== "detected" && (
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-black">
            <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
            <button 
              onClick={() => { setImagePreview(null); setImageBase64(""); }}
              className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              ×
            </button>
          </div>
          <Button onClick={handleScan} className="w-full brand-gradient text-white hover:opacity-90">
            <Sparkles className="mr-2 h-4 w-4" /> Scan packaging with Groq AI Vision
          </Button>
        </div>
      )}

      {status === "detected" && (
        <div className="space-y-4 animate-float-up">
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <CheckCircle2 className="h-4.5 w-4.5" /> AI Scan completed! Confirm details below:
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Product name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Food", "Medicine", "Cosmetics", "Household"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Expiry date (estimated or detected)</Label>
              <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setStatus("idle");
                setScanResult(null);
              }}
              className="flex-1"
            >
              <RefreshCw className="mr-1.5 h-4 w-4" /> Scan another
            </Button>
            <Button onClick={handleConfirm} className="flex-1 brand-gradient text-white hover:opacity-90">
              Confirm & Add to Shelf
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
