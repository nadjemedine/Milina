import { db } from "@/db";
import {
  categories,
  products,
  orders,
  customers,
  settings,
  integrations,
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import type {
  CategoryDTO,
  ProductDTO,
  OrderDTO,
} from "./types";

// ============ Seed ============
const SEED_CATEGORIES = [
  { slug: "tout", name: "Tout", sortOrder: 0 },
  { slug: "ensembles", name: "Ensembles", sortOrder: 1 },
  { slug: "vestes", name: "vestes", sortOrder: 2 },
  { slug: "kimonos", name: "Kimonos", sortOrder: 3 },
  { slug: "robes", name: "Robes", sortOrder: 4 },
  { slug: "hauts", name: "Hauts", sortOrder: 5 },
  { slug: "jupes", name: "Jupes", sortOrder: 6 },
  { slug: "accessoires", name: "Accessoires", sortOrder: 7 },
  { slug: "caftans", name: "Caftans", sortOrder: 8 },
];

const SEED_PRODUCTS = [
  {
    slug: "caftan-le-royal",
    name: "Caftan Le Royal",
    description: "Caftan royal brodé à la main, idéal pour vos soirées de prestige.",
    category: "caftans",
    price: 18900,
    comparePrice: null,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Doré", "Ivoire"],
    tags: ["nouveau", "premium"],
    isFeatured: true,
  },
  {
    slug: "night-dress",
    name: "Night Dress",
    description: "Robe longue fluide en satin, parfaite pour les grandes occasions.",
    category: "robes",
    price: 4500,
    comparePrice: null,
    stock: 24,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Gris perle"],
    tags: ["tendance"],
    isFeatured: true,
  },
  {
    slug: "summer-top",
    name: "Summer Top",
    description: "Haut léger à motifs tie & dye, ultra confortable.",
    category: "hauts",
    price: 3200,
    comparePrice: null,
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1551803091-e20673f15770?w=1200&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multicolore"],
    tags: ["été"],
    isFeatured: true,
  },
  {
    slug: "gilet-brode",
    name: "Gilet Brodé",
    description: "Gilet sans manches avec broderies traditionnelles, élégance assurée.",
    category: "vestes",
    price: 3900,
    comparePrice: null,
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Noir"],
    tags: ["best-seller"],
    isFeatured: true,
  },
  {
    slug: "kimono-zebre",
    name: "Kimono Zébré",
    description: "Kimono long à motifs zèbre, pièce statement.",
    category: "kimonos",
    price: 2200,
    comparePrice: 4000,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=1200&q=80",
    ],
    sizes: ["Unique"],
    colors: ["Noir & Blanc"],
    tags: ["solde", "-44%"],
    isFeatured: true,
  },
  {
    slug: "abaya-oud",
    name: "Abaya Oud",
    description: "Abaya ample en tissu oud avec finitions dorées.",
    category: "robes",
    price: 4700,
    comparePrice: null,
    stock: 10,
    images: [
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=1200&q=80",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Marron"],
    tags: ["premium"],
    isFeatured: true,
  },
  {
    slug: "robe-cocktail-noire",
    name: "Robe Cocktail Noire",
    description: "Robe noire cintrée parfaite pour vos cocktails.",
    category: "robes",
    price: 5800,
    comparePrice: 7400,
    stock: 9,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Noir"],
    tags: ["solde", "-22%"],
    isFeatured: false,
  },
  {
    slug: "ensemble-lin-premium",
    name: "Ensemble Lin Premium",
    description: "Ensemble deux pièces en lin, look minimaliste et chic.",
    category: "ensembles",
    price: 6900,
    comparePrice: null,
    stock: 14,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Beige", "Noir"],
    tags: ["nouveau"],
    isFeatured: false,
  },
  {
    slug: "jupe-midi-plissee",
    name: "Jupe Midi Plissée",
    description: "Jupe midi plissée, fluide et élégante.",
    category: "jupes",
    price: 3400,
    comparePrice: null,
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=1200&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Noir", "Crème"],
    tags: ["tendance"],
    isFeatured: false,
  },
  {
    slug: "sac-cuir-noir",
    name: "Sac Cuir Noir",
    description: "Sac à main en cuir véritable, finition premium.",
    category: "accessoires",
    price: 4200,
    comparePrice: 5500,
    stock: 7,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80",
    ],
    sizes: ["Unique"],
    colors: ["Noir"],
    tags: ["solde"],
    isFeatured: false,
  },
  {
    slug: "veste-tailleur-creme",
    name: "Veste Tailleur Crème",
    description: "Veste tailleur coupe oversize en couleur crème.",
    category: "vestes",
    price: 5200,
    comparePrice: null,
    stock: 11,
    images: [
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1200&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crème"],
    tags: ["bureau"],
    isFeatured: false,
  },
  {
    slug: "haut-satin-blanc",
    name: "Haut Satin Blanc",
    description: "Haut en satin blanc à col bénitier.",
    category: "hauts",
    price: 2800,
    comparePrice: null,
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1564257577-2d3a3f0b8a32?w=1200&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blanc"],
    tags: ["essentiel"],
    isFeatured: false,
  },
];

const SEED_SETTINGS = [
  { key: "site_name", value: "Milina Luxury" },
  { key: "site_tagline", value: "Boutique de prêt-à-porter féminin" },
  { key: "contact_email", value: "milina.luxury@gmail.com" },
  { key: "contact_phone", value: "+213 555 000 000" },
  { key: "contact_address", value: "Algerie, Alger" },
  { key: "instagram_url", value: "https://instagram.com/milina.luxury" },
  { key: "facebook_url", value: "https://facebook.com/milina.luxury" },
  { key: "shipping_notice", value: "Livraison Rapide 58 Wilayas" },
  { key: "hero_title", value: "CAFTAN LE ROYAL" },
  { key: "hero_subtitle", value: "La nouvelle collection exclusive" },
  {
    key: "about_text",
    value:
      "Milina Luxury est votre boutique en ligne de prêt à porter pour femmes. Chez Milina Luxury, l'originalité est la seule règle. Révélez l'exception qui est en vous !",
  },
];

export async function ensureSeedData() {
  // Categories and products seeding disabled


  // Settings
  for (const s of SEED_SETTINGS) {
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, s.key))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(settings).values({ key: s.key, value: s.value });
    }
  }

  // Supabase integration placeholder
  const existingIntegration = await db
    .select()
    .from(integrations)
    .where(eq(integrations.name, "supabase"))
    .limit(1);
  if (existingIntegration.length === 0) {
    await db.insert(integrations).values({
      name: "supabase",
      config: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      },
      isActive: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
  }
}

// ============ Mappers ============
function toProductDTO(
  p: typeof products.$inferSelect,
  categorySlug?: string | null
): ProductDTO {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    categoryId: p.categoryId,
    categorySlug,
    price: parseFloat(p.price),
    comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
    currency: p.currency,
    stock: p.stock,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    tags: p.tags,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
  };
}

function toCategoryDTO(c: typeof categories.$inferSelect): CategoryDTO {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    imageUrl: c.imageUrl,
    isActive: c.isActive,
  };
}

function toOrderDTO(o: typeof orders.$inferSelect): OrderDTO {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerEmail: o.customerEmail,
    wilaya: o.wilaya,
    commune: o.commune,
    address: o.address,
    notes: o.notes,
    items: o.items,
    subtotal: parseFloat(o.subtotal),
    shipping: parseFloat(o.shipping),
    total: parseFloat(o.total),
    status: o.status,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt.toISOString(),
  };
}

// ============ Public Read APIs ============
export async function getCategories(): Promise<CategoryDTO[]> {
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.sortOrder);
  return rows.map(toCategoryDTO);
}

export async function getProducts(filter?: {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
}): Promise<ProductDTO[]> {
  // Run two parallel queries to keep types simple
  const [allRows, cats] = await Promise.all([
    db.select().from(products).orderBy(desc(products.createdAt)),
    db.select().from(categories),
  ]);
  const catMap = new Map(cats.map((c) => [c.id, c.slug]));

  let result: ProductDTO[] = allRows
    .filter((p) => p.isActive)
    .map((p) => toProductDTO(p, catMap.get(p.categoryId ?? -1) ?? null));

  if (filter?.featured !== undefined) {
    result = result.filter((p) => p.isFeatured === filter.featured);
  }
  if (filter?.category && filter.category !== "tout") {
    result = result.filter((p) => p.categorySlug === filter.category);
  }
  if (filter?.search) {
    const term = filter.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description?.toLowerCase().includes(term) ?? false)
    );
  }
  if (filter?.limit) result = result.slice(0, filter.limit);
  return result;
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  if (rows.length === 0) return null;
  const cats = await db.select().from(categories);
  const catMap = new Map(cats.map((c) => [c.id, c.slug]));
  return toProductDTO(rows[0], catMap.get(rows[0].categoryId ?? -1) ?? null);
}

// ============ Admin APIs ============
export async function adminListProducts(): Promise<ProductDTO[]> {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  const cats = await db.select().from(categories);
  const catMap = new Map(cats.map((c) => [c.id, c.slug]));
  return rows.map((p) => toProductDTO(p, catMap.get(p.categoryId ?? -1) ?? null));
}

export async function adminListCategories(): Promise<CategoryDTO[]> {
  const rows = await db.select().from(categories).orderBy(categories.sortOrder);
  return rows.map(toCategoryDTO);
}

export async function adminListOrders(): Promise<OrderDTO[]> {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return rows.map(toOrderDTO);
}

export async function adminStats() {
  const [productCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  const [categoryCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categories);
  const [orderCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders);
  const [customerCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(customers);
  const [revenue] = await db
    .select({ total: sql<string>`coalesce(sum(total), 0)::text` })
    .from(orders);

  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  const cats = await db.select().from(categories);
  const productsByCategory = await db
    .select({
      categoryId: products.categoryId,
      count: sql<number>`count(*)::int`,
    })
    .from(products)
    .groupBy(products.categoryId);
  const catMap = new Map(cats.map((c) => [c.id, c.name]));

  return {
    products: productCount?.count ?? 0,
    categories: categoryCount?.count ?? 0,
    orders: orderCount?.count ?? 0,
    customers: customerCount?.count ?? 0,
    revenue: parseFloat(revenue?.total ?? "0"),
    recentOrders: recentOrders.map(toOrderDTO),
    productsByCategory: productsByCategory.map((p) => ({
      name: p.categoryId ? catMap.get(p.categoryId) ?? "Sans catégorie" : "Sans catégorie",
      count: p.count,
    })),
  };
}

export async function getAllSettings() {
  const rows = await db.select().from(settings);
  const result: Record<string, unknown> = {};
  for (const r of rows) {
    result[r.key] = r.value;
  }
  return result;
}

export async function getSupabaseIntegration() {
  const rows = await db
    .select()
    .from(integrations)
    .where(eq(integrations.name, "supabase"))
    .limit(1);
  return rows[0] ?? null;
}