import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "./useAuth";
import { products as initialSeed } from "../lib/mock-data";
import { toast } from "sonner";

// Helper to map DB snake_case columns to Client camelCase keys
function mapFromDb(dbProd) {
  if (!dbProd) return null;
  return {
    id: dbProd.id,
    name: dbProd.name,
    category: dbProd.category,
    quantity: dbProd.quantity,
    purchaseDate: dbProd.purchase_date,
    expiryDate: dbProd.expiry_date,
    notes: dbProd.notes || "",
    owner: dbProd.owner,
    donatable: dbProd.donatable || false,
    userId: dbProd.user_id,
  };
}

// Helper to map Client camelCase keys to DB snake_case columns
function mapToDb(clientProd, userId) {
  if (!clientProd) return null;
  return {
    name: clientProd.name,
    category: clientProd.category,
    quantity: clientProd.quantity || "1 unit",
    purchase_date: clientProd.purchaseDate || new Date().toISOString().slice(0, 10),
    expiry_date: clientProd.expiryDate,
    notes: clientProd.notes || "",
    owner: clientProd.owner,
    donatable: clientProd.donatable || false,
    user_id: userId,
  };
}

export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        // Query user's own products or any donatable product from other users
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("expiry_date", { ascending: true });

        if (error) throw error;
        setProducts(data.map(mapFromDb));
      } catch (err) {
        console.error("Error fetching products from Supabase:", err);
        toast.error("Failed to load products from database.");
      } finally {
        setLoading(false);
      }
    } else {
      // localStorage mock logic
      const localData = localStorage.getItem("reshelf_local_products");
      if (localData) {
        try {
          setProducts(JSON.parse(localData));
        } catch (e) {
          localStorage.removeItem("reshelf_local_products");
          setProducts(initialSeed);
        }
      } else {
        localStorage.setItem("reshelf_local_products", JSON.stringify(initialSeed));
        setProducts(initialSeed);
      }
      setLoading(false);
    }
  }, [user]);

  // Load products initially on mount or when user changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add Product
  const addProduct = async (productData) => {
    if (!user) throw new Error("Unauthenticated user.");

    if (isSupabaseConfigured) {
      const dbPayload = mapToDb(
        {
          ...productData,
          owner: user.full_name,
        },
        user.id,
      );

      const { data, error } = await supabase.from("products").insert([dbPayload]).select().single();

      if (error) throw error;
      const newProd = mapFromDb(data);
      setProducts((prev) => [newProd, ...prev]);
      return newProd;
    } else {
      const newProd = {
        id: crypto.randomUUID(),
        name: productData.name,
        category: productData.category,
        quantity: productData.quantity || "1 unit",
        purchaseDate: productData.purchaseDate || new Date().toISOString().slice(0, 10),
        expiryDate: productData.expiryDate,
        notes: productData.notes || "",
        owner: user.full_name,
        donatable: productData.donatable || false,
        userId: user.id,
      };

      const updated = [newProd, ...products];
      localStorage.setItem("reshelf_local_products", JSON.stringify(updated));
      setProducts(updated);
      return newProd;
    }
  };

  // Update Product
  const updateProduct = async (id, updates) => {
    if (!user) throw new Error("Unauthenticated user.");

    if (isSupabaseConfigured) {
      // Map only updated keys to snake_case if they exist
      const dbPayload = {};
      if (updates.name !== undefined) dbPayload.name = updates.name;
      if (updates.category !== undefined) dbPayload.category = updates.category;
      if (updates.quantity !== undefined) dbPayload.quantity = updates.quantity;
      if (updates.purchaseDate !== undefined) dbPayload.purchase_date = updates.purchaseDate;
      if (updates.expiryDate !== undefined) dbPayload.expiry_date = updates.expiryDate;
      if (updates.notes !== undefined) dbPayload.notes = updates.notes;
      if (updates.owner !== undefined) dbPayload.owner = updates.owner;
      if (updates.donatable !== undefined) dbPayload.donatable = updates.donatable;

      const { data, error } = await supabase
        .from("products")
        .update(dbPayload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      const updatedProd = mapFromDb(data);
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProd : p)));
      return updatedProd;
    } else {
      const updated = products.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updates,
          };
        }
        return p;
      });
      localStorage.setItem("reshelf_local_products", JSON.stringify(updated));
      setProducts(updated);
      return updated.find((x) => x.id === id);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    if (!user) throw new Error("Unauthenticated user.");

    if (isSupabaseConfigured) {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      const updated = products.filter((p) => p.id !== id);
      localStorage.setItem("reshelf_local_products", JSON.stringify(updated));
      setProducts(updated);
    }
  };

  return {
    products,
    loading,
    refresh: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
