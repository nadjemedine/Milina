// Shared types between client and server
export interface ProductDTO {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  categoryId: number | null;
  categorySlug?: string | null;
  price: number;
  comparePrice: number | null;
  currency: string;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
}

export interface CategoryDTO {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface OrderDTO {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  wilaya: string;
  commune: string;
  address: string;
  notes: string | null;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "card" | "transfer";
  createdAt: string;
}