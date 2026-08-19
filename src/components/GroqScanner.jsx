import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Camera,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { scanProductWithGroq, getGroqConfigStatus } from "../lib/api/groq.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function GroqScanner({ onAdd, onClose }) {
  const [activeTab, setActiveTab] = useState("camera"); // camera, upload
  const [isConfigured, setIsConfigured] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [status, setStatus] = useState("idle"); // idle, reading, scanning, detected
  const [scanResult, setScanResult] = useState(null);

  // Webcam states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);

  // Form states for confirmation
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [quantity, setQuantity] = useState("1 unit");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");

  // Check if Groq API Key is configured on mount
  useEffect(() => {
    async function checkConfig() {
      try {
        const res = await getGroqConfigStatus();
        setIsConfigured(res.isConfigured);
      } catch (err) {
        console.error("Failed to check Groq config status:", err);
      }
    }
    checkConfig();
  }, []);

  // Manage camera lifecycle
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access failed:", err);
      setCameraError("Camera access denied or unavailable. Please use file upload.");
      setActiveTab("upload");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Start or stop camera based on tab and preview state
  useEffect(() => {
    if (activeTab === "camera" && (status === "idle" || status === "reading") && !imagePreview) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, status, imagePreview]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        setImageBase64(dataUrl);
        stopCamera();
      }
    } catch (err) {
      console.error("Failed to capture image:", err);
      toast.error("Failed to capture photo from camera.");
    }
  };

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
      id: crypto.randomUUID(),
      name,
      category,
      quantity,
      purchaseDate: new Date().toISOString().slice(0, 10),
      expiryDate,
      owner: "Aisha Khan",
      notes: notes + " (Groq AI Vision Scanned)",
      donatable: false,
    });

    onClose();
  };

  return (
    <div className="space-y-4">
      {/* Configuration Status Notice */}
      {!isConfigured && (
        <div className="flex items-start gap-2 px-3 py-2 text-xs rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
          <span>
            <strong>Demo Mode Active:</strong> <code>GROQ_API_KEY</code> is not configured in your{" "}
            <code>.env</code> file. Scanner will simulate scans with a demo product.
          </span>
        </div>
      )}

      {status === "scanning" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center border border-border rounded-2xl bg-card">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="space-y-1">
            <h4 className="font-semibold text-base flex items-center gap-1.5 justify-center">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Groq AI Vision Active
            </h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Reading bill, receipt, packet, or packaging...
            </p>
          </div>
        </div>
      )}

      {/* Input Mode Selector */}
      {status === "idle" && !imagePreview && (
        <div className="flex border border-border/60 mb-2 p-1 rounded-xl bg-muted/30">
          <button
            onClick={() => setActiveTab("camera")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5",
              activeTab === "camera"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Camera className="h-3.5 w-3.5" /> Camera Capture
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5",
              activeTab === "upload"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Upload className="h-3.5 w-3.5" /> File Upload
          </button>
        </div>
      )}

      {/* Camera Live Viewfinder */}
      {activeTab === "camera" && status === "idle" && !imagePreview && (
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-black">
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
                <p className="text-sm font-medium">{cameraError}</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
                {/* Viewfinder target box */}
                <div className="absolute inset-8 rounded-xl border-2 border-white/25 pointer-events-none">
                  <span className="absolute -top-0.5 -left-0.5 h-6 w-6 border-t-2 border-l-2 border-primary rounded-tl-xl" />
                  <span className="absolute -top-0.5 -right-0.5 h-6 w-6 border-t-2 border-r-2 border-primary rounded-tr-xl" />
                  <span className="absolute -bottom-0.5 -left-0.5 h-6 w-6 border-b-2 border-l-2 border-primary rounded-bl-xl" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-6 w-6 border-b-2 border-r-2 border-primary rounded-br-xl" />
                </div>
              </>
            )}
          </div>
          {!cameraError && (
            <Button
              onClick={handleCapture}
              className="w-full brand-gradient text-white hover:opacity-90 font-medium"
            >
              <Camera className="mr-2 h-4 w-4" /> Capture Bill, Receipt, or Packet
            </Button>
          )}
        </div>
      )}

      {/* File Upload Mode */}
      {activeTab === "upload" && (status === "idle" || status === "reading") && !imagePreview && (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-card hover:bg-muted/30 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <p className="mb-2 text-sm font-semibold">
                Click to upload bill, receipt, or packet image
              </p>
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

      {/* Image Preview & Scan trigger */}
      {imagePreview && status !== "scanning" && status !== "detected" && (
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-black">
            <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
            <button
              onClick={() => {
                setImagePreview(null);
                setImageBase64("");
              }}
              className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              ×
            </button>
          </div>
          <Button
            onClick={handleScan}
            className="w-full brand-gradient text-white hover:opacity-90 font-medium"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Scan bill, receipt, or packet with Groq AI
          </Button>
        </div>
      )}

      {/* Results Confirmation Form */}
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Food", "Medicine", "Cosmetics", "Household"].map((c) => (
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
              <Label>Expiry date (estimated or detected)</Label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
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
                setImagePreview(null);
                setImageBase64("");
                setStatus("idle");
                setScanResult(null);
              }}
              className="flex-1"
            >
              <RefreshCw className="mr-1.5 h-4 w-4" /> Scan another
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 brand-gradient text-white hover:opacity-90 font-medium"
            >
              Confirm & Add to Shelf
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
