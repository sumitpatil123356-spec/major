export type Category = "Food" | "Medicine" | "Cosmetics" | "Household";
export type Status = "safe" | "warning" | "critical";

export interface Product {
  id: string;
  name: string;
  category: Category;
  quantity: string;
  purchaseDate: string;
  expiryDate: string;
  notes?: string;
  owner: string;
  donatable?: boolean;
}

export interface Ngo {
  id: string;
  name: string;
  location: string;
  categories: Category[];
  phone: string;
  email: string;
  pickup: string;
  rating: number;
}

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const daysRemaining = (expiry: string) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const exp = new Date(expiry);
  return Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const statusOf = (expiry: string): Status => {
  const d = daysRemaining(expiry);
  if (d <= 7) return "critical";
  if (d <= 30) return "warning";
  return "safe";
};

export const products: Product[] = [
  { id: "p1", name: "Organic Whole Milk", category: "Food", quantity: "2 L", purchaseDate: daysFromNow(-5), expiryDate: daysFromNow(2), owner: "Aisha Khan", donatable: true, notes: "Refrigerated, unopened" },
  { id: "p2", name: "Paracetamol 500mg", category: "Medicine", quantity: "30 tablets", purchaseDate: daysFromNow(-40), expiryDate: daysFromNow(120), owner: "Aisha Khan" },
  { id: "p3", name: "Whole Wheat Bread", category: "Food", quantity: "1 loaf", purchaseDate: daysFromNow(-2), expiryDate: daysFromNow(4), owner: "Sunrise Cafe", donatable: true },
  { id: "p4", name: "Greek Yogurt", category: "Food", quantity: "12 cups", purchaseDate: daysFromNow(-3), expiryDate: daysFromNow(6), owner: "Sunrise Cafe", donatable: true },
  { id: "p5", name: "Hand Sanitizer", category: "Cosmetics", quantity: "500 ml", purchaseDate: daysFromNow(-200), expiryDate: daysFromNow(45), owner: "Aisha Khan" },
  { id: "p6", name: "Cough Syrup", category: "Medicine", quantity: "100 ml", purchaseDate: daysFromNow(-90), expiryDate: daysFromNow(18), owner: "MediCare Pharmacy", donatable: true },
  { id: "p7", name: "Pasta Sauce", category: "Food", quantity: "6 jars", purchaseDate: daysFromNow(-10), expiryDate: daysFromNow(75), owner: "Sunrise Cafe" },
  { id: "p8", name: "Multivitamins", category: "Medicine", quantity: "60 caps", purchaseDate: daysFromNow(-60), expiryDate: daysFromNow(220), owner: "MediCare Pharmacy" },
  { id: "p9", name: "Dish Soap", category: "Household", quantity: "750 ml", purchaseDate: daysFromNow(-15), expiryDate: daysFromNow(400), owner: "Aisha Khan" },
  { id: "p10", name: "Baby Formula", category: "Food", quantity: "800 g", purchaseDate: daysFromNow(-30), expiryDate: daysFromNow(25), owner: "GreenMart Grocery", donatable: true },
  { id: "p11", name: "Vitamin D3 Drops", category: "Medicine", quantity: "30 ml", purchaseDate: daysFromNow(-20), expiryDate: daysFromNow(9), owner: "MediCare Pharmacy", donatable: true },
  { id: "p12", name: "Fresh Apples", category: "Food", quantity: "5 kg", purchaseDate: daysFromNow(-1), expiryDate: daysFromNow(10), owner: "GreenMart Grocery", donatable: true },
  { id: "p13", name: "Moisturizer", category: "Cosmetics", quantity: "200 ml", purchaseDate: daysFromNow(-100), expiryDate: daysFromNow(60), owner: "Aisha Khan" },
  { id: "p14", name: "Brown Rice", category: "Food", quantity: "10 kg", purchaseDate: daysFromNow(-30), expiryDate: daysFromNow(180), owner: "GreenMart Grocery" },
];

export const ngos: Ngo[] = [
  { id: "n1", name: "Helping Hands", location: "Bengaluru, KA", categories: ["Food", "Household"], phone: "+91 98800 11223", email: "contact@helpinghands.org", pickup: "Daily, 10am – 6pm", rating: 4.9 },
  { id: "n2", name: "Food Bank India", location: "Mumbai, MH", categories: ["Food"], phone: "+91 98201 55667", email: "hello@foodbankindia.org", pickup: "Mon–Sat, 9am – 5pm", rating: 4.8 },
  { id: "n3", name: "Community Kitchen", location: "Delhi, DL", categories: ["Food", "Household"], phone: "+91 99100 88445", email: "team@communitykitchen.in", pickup: "Daily, 11am – 8pm", rating: 4.7 },
  { id: "n4", name: "Care Foundation", location: "Hyderabad, TS", categories: ["Medicine", "Cosmetics"], phone: "+91 99490 22113", email: "support@carefoundation.org", pickup: "Tue–Sun, 10am – 4pm", rating: 4.8 },
];

export const monthlyActivity = [
  { month: "Jan", donations: 12, waste: 4 },
  { month: "Feb", donations: 18, waste: 5 },
  { month: "Mar", donations: 22, waste: 3 },
  { month: "Apr", donations: 28, waste: 4 },
  { month: "May", donations: 35, waste: 2 },
  { month: "Jun", donations: 42, waste: 3 },
  { month: "Jul", donations: 48, waste: 2 },
  { month: "Aug", donations: 56, waste: 2 },
  { month: "Sep", donations: 61, waste: 1 },
  { month: "Oct", donations: 70, waste: 2 },
  { month: "Nov", donations: 82, waste: 1 },
  { month: "Dec", donations: 95, waste: 1 },
];

export const categoryBreakdown = [
  { name: "Food", value: 58 },
  { name: "Medicine", value: 22 },
  { name: "Cosmetics", value: 12 },
  { name: "Household", value: 8 },
];

export const savingsTrend = [
  { month: "Jan", saved: 420 },
  { month: "Feb", saved: 580 },
  { month: "Mar", saved: 720 },
  { month: "Apr", saved: 860 },
  { month: "May", saved: 1020 },
  { month: "Jun", saved: 1240 },
  { month: "Jul", saved: 1410 },
  { month: "Aug", saved: 1680 },
  { month: "Sep", saved: 1890 },
  { month: "Oct", saved: 2140 },
  { month: "Nov", saved: 2380 },
  { month: "Dec", saved: 2640 },
];

export const kpis = {
  totalProducts: products.length,
  expiringSoon: products.filter(p => statusOf(p.expiryDate) !== "safe").length,
  donationsMade: 128,
  wastePrevented: "342 kg",
  moneySaved: "₹ 2,64,000",
};

export const communityImpact = {
  totalDonations: 8420,
  mealsSaved: 21300,
  productsRedistributed: 12880,
  impactScore: 94,
};

export const sampleUsers = [
  { id: "u1", name: "Aisha Khan", email: "aisha@example.com", role: "Household", joined: "Jan 2025", status: "Active" },
  { id: "u2", name: "Sunrise Cafe", email: "ops@sunrisecafe.in", role: "Business", joined: "Feb 2025", status: "Active" },
  { id: "u3", name: "MediCare Pharmacy", email: "admin@medicare.in", role: "Business", joined: "Mar 2025", status: "Active" },
  { id: "u4", name: "GreenMart Grocery", email: "team@greenmart.in", role: "Business", joined: "Apr 2025", status: "Active" },
  { id: "u5", name: "Helping Hands", email: "contact@helpinghands.org", role: "NGO", joined: "May 2025", status: "Active" },
  { id: "u6", name: "Rohan Verma", email: "rohan@example.com", role: "Household", joined: "Jun 2025", status: "Pending" },
];

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand: string;
  category: Category;
  packageSize: string;
  image: string;
  defaultShelfLifeDays: number;
}

export const barcodeDatabase: BarcodeProduct[] = [
  {
    barcode: "8901030865278",
    name: "Organic Whole Milk",
    brand: "Amul",
    category: "Food",
    packageSize: "1 L Tetra Pak",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    defaultShelfLifeDays: 7,
  },
  {
    barcode: "8902080001234",
    name: "Whole Wheat Bread",
    brand: "Britannia",
    category: "Food",
    packageSize: "400 g loaf",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    defaultShelfLifeDays: 5,
  },
  {
    barcode: "8904004400123",
    name: "Greek Yogurt — Natural",
    brand: "Epigamia",
    category: "Food",
    packageSize: "150 g cup",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    defaultShelfLifeDays: 14,
  },
  {
    barcode: "5000112637922",
    name: "Paracetamol 500mg",
    brand: "Cipla",
    category: "Medicine",
    packageSize: "Strip of 15 tablets",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    defaultShelfLifeDays: 365,
  },
  {
    barcode: "8901138511012",
    name: "Hand Sanitizer Gel",
    brand: "Dettol",
    category: "Cosmetics",
    packageSize: "500 ml bottle",
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=400&fit=crop",
    defaultShelfLifeDays: 540,
  },
  {
    barcode: "8901058000016",
    name: "Pasta Sauce — Tomato Basil",
    brand: "Maggi",
    category: "Food",
    packageSize: "400 g jar",
    image: "https://images.unsplash.com/photo-1608219994488-cc269412b3e2?w=400&h=400&fit=crop",
    defaultShelfLifeDays: 180,
  },
  {
    barcode: "8901491100533",
    name: "Dish Wash Liquid",
    brand: "Vim",
    category: "Household",
    packageSize: "750 ml bottle",
    image: "https://images.unsplash.com/photo-1585670210693-ef27973793b9?w=400&h=400&fit=crop",
    defaultShelfLifeDays: 720,
  },
  {
    barcode: "8901030712345",
    name: "Daily Moisturizer SPF 30",
    brand: "Nivea",
    category: "Cosmetics",
    packageSize: "200 ml tube",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    defaultShelfLifeDays: 365,
  },
];
