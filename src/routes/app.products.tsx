import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2, ScanLine, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Product, type Category } from "@/lib/mock-data";
import { ScanProductDialog } from "@/components/scan-product-dialog";
import { useProducts } from "../hooks/useProducts";
import { toast } from "sonner";

export const Route = createFileRoute("/app/products")({
  head: () => ({ meta: [{ title: "Products — ReShelf" }] }),
  component: ProductsPage,
});

const categories: Category[] = ["Food", "Medicine", "Cosmetics", "Household"];

function ProductsPage() {
  const { products: items, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("expiry");
  const [open, setOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filtered = useMemo(() => {
    let r = items.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        p.name.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === "expiry") r = r.sort((a, b) => +new Date(a.expiryDate) - +new Date(b.expiryDate));
    if (sort === "name") r = r.sort((a, b) => a.name.localeCompare(b.name));
    return r;
  }, [items, q, cat, sort]);

  const handleAdd = async (p) => {
    try {
      await addProduct(p);
      setOpen(false);
      toast.success(`${p.name} added`);
    } catch (err) {
      toast.error("Failed to add product: " + err.message);
    }
  };

  const handleEdit = async (id, updates) => {
    try {
      await updateProduct(id, updates);
      setEditingProduct(null);
      toast.success("Product updated");
    } catch (err) {
      toast.error("Failed to update product: " + err.message);
    }
  };

  const handleDelete = async (p) => {
    try {
      await deleteProduct(p.id);
      toast.success(`${p.name} removed`);
    } catch (err) {
      toast.error("Failed to delete product: " + err.message);
    }
  };

  return (
    <AppShell
      title="Products"
      subtitle="Manage everything on your shelf."
      actions={
        <>
          <Button variant="outline" onClick={() => setScanOpen(true)}>
            <ScanLine className="mr-1.5 h-4 w-4" /> Scan product
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="brand-gradient text-white hover:opacity-90">
                <Plus className="mr-1.5 h-4 w-4" /> Add product
              </Button>
            </DialogTrigger>
            <AddProductDialog onAdd={handleAdd} />
          </Dialog>
          <ScanProductDialog open={scanOpen} onOpenChange={setScanOpen} onAdd={handleAdd} />
        </>
      }
    >
      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-40"><Filter className="mr-1.5 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="expiry">Sort: Expiry</SelectItem>
              <SelectItem value="name">Sort: Name</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mt-4 border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading shelf...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  {["Product", "Category", "Quantity", "Expiry", "Status", "Owner", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{p.name}</td>
                    <td className="px-5 py-3"><Badge variant="secondary">{p.category}</Badge></td>
                    <td className="px-5 py-3 text-muted-foreground">{p.quantity}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.expiryDate}</td>
                    <td className="px-5 py-3"><StatusBadge expiry={p.expiryDate} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{p.owner}</td>
                    <td className="px-5 py-3 text-right">
                      <Button size="icon" variant="ghost" onClick={() => setEditingProduct(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(p)}>
                        <Trash2 className="h-4 w-4 text-critical" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">No products match your filters.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(o) => !o && setEditingProduct(null)}>
        {editingProduct && (
          <EditProductDialog product={editingProduct} onSave={(updates) => handleEdit(editingProduct.id, updates)} />
        )}
      </Dialog>
    </AppShell>
  );
}

function AddProductDialog({ onAdd }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [notes, setNotes] = useState("");
  const [donatable, setDonatable] = useState(false);

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Add product</DialogTitle></DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name || !expiry) return;
          onAdd({
            name,
            category,
            quantity: quantity || "1 unit",
            purchaseDate: new Date().toISOString().slice(0, 10),
            expiryDate: expiry,
            notes,
            donatable,
          });
        }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="col-span-2 space-y-1.5"><Label>Product name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Quantity</Label><Input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 2 L" /></div>
        <div className="space-y-1.5"><Label>Purchase date</Label><Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></div>
        <div className="space-y-1.5"><Label>Expiry date</Label><Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} required /></div>
        <div className="col-span-2 flex items-center gap-2 pt-2">
          <input 
            type="checkbox" 
            id="donatable" 
            checked={donatable}
            onChange={(e) => setDonatable(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="donatable" className="cursor-pointer text-sm font-medium">List on Rescue Hub (Available for donation)</Label>
        </div>
        <div className="col-span-2 space-y-1.5"><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} /></div>
        <DialogFooter className="col-span-2">
          <Button type="submit" className="brand-gradient text-white hover:opacity-90">Save product</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function EditProductDialog({ product, onSave }) {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [quantity, setQuantity] = useState(product.quantity);
  const [expiry, setExpiry] = useState(product.expiryDate);
  const [notes, setNotes] = useState(product.notes || "");
  const [donatable, setDonatable] = useState(product.donatable || false);

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Edit product</DialogTitle></DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name || !expiry) return;
          onSave({
            name,
            category,
            quantity,
            expiryDate: expiry,
            notes,
            donatable,
          });
        }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="col-span-2 space-y-1.5"><Label>Product name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Quantity</Label><Input value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
        <div className="space-y-1.5"><Label>Expiry date</Label><Input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} required /></div>
        <div className="col-span-2 flex items-center gap-2 pt-2">
          <input 
            type="checkbox" 
            id="edit-donatable" 
            checked={donatable}
            onChange={(e) => setDonatable(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="edit-donatable" className="cursor-pointer text-sm font-medium">List on Rescue Hub (Available for donation)</Label>
        </div>
        <div className="col-span-2 space-y-1.5"><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} /></div>
        <DialogFooter className="col-span-2">
          <Button type="submit" className="brand-gradient text-white hover:opacity-90">Update details</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
