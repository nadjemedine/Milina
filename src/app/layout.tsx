import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/store/CartProvider";
import { StoreChrome } from "@/components/store/StoreChrome";
import { ensureSeedData } from "@/lib/data";
import { getCategories, getAllSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Milina Luxury — Boutique Femme | Caftans, Robes & Kimonos",
  description:
    "Milina Luxury, votre boutique en ligne de prêt-à-porter féminin. Découvrez nos caftans, robes, kimonos et accessoires. Livraison rapide 58 wilayas, paiement à la livraison.",
  keywords: [
    "milina",
    "boutique femme",
    "caftan",
    "robe",
    "kimono",
    "abaya",
    "algérie",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Bootstrap DB schema + seed on first request
  try {
    await ensureSeedData();
  } catch {
    // DB might not be ready; UI still renders
  }

  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let settings: Awaited<ReturnType<typeof getAllSettings>> = {};
  try {
    [categories, settings] = await Promise.all([
      getCategories(),
      getAllSettings(),
    ]);
  } catch {
    // ignore — pages handle missing DB gracefully
  }

  return (
    <html
      lang="fr"
      style={{
        "--topbar-bg": settings.color_topbar_bg || undefined,
        "--topbar-text": settings.color_topbar_text || undefined,
        "--header-bg": settings.color_header_bg || undefined,
        "--header-icon": settings.color_header_icon || undefined,
        "--menu-bg": settings.color_menu_bg || undefined,
        "--menu-text": settings.color_menu_text || undefined,
        "--bottombar-bg": settings.color_bottombar_bg || undefined,
        "--bottombar-icon-text": settings.color_bottombar_icon_text || undefined,
        "--store-bg": settings.color_store_bg || undefined,
        "--product-card-bg": settings.color_product_card_bg || undefined,
        "--product-card-btn-icon": settings.color_product_card_btn_icon || undefined,
        "--features-bg": settings.color_features_bg || undefined,
        "--footer-bg": settings.color_footer_bg || undefined,
        "--product-back-btn": settings.color_product_back_btn || undefined,
        "--product-fav-icon": settings.color_product_fav_icon || undefined,
        "--product-variant-btn": settings.color_product_variant_btn || undefined,
        "--add-to-cart-btn": settings.color_add_to_cart_btn || undefined,
        "--order-btn": settings.color_order_btn || undefined,
      } as React.CSSProperties}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        {typeof settings.favicon_image === "string" && settings.favicon_image && (
          <link rel="icon" href={settings.favicon_image} />
        )}
      </head>
      <body className="min-h-screen bg-[var(--store-bg,#ffffff)] text-black antialiased">
        <CartProvider>
          <StoreChrome categories={categories} settings={settings}>
            {children}
          </StoreChrome>
        </CartProvider>
      </body>
    </html>
  );
}
