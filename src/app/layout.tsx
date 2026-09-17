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
    <html lang="fr">
      <head>
        {settings.favicon_image && (
          <link rel="icon" href={settings.favicon_image as string} />
        )}
      </head>
      <body className="min-h-screen bg-white text-black antialiased">
        <CartProvider>
          <StoreChrome categories={categories} settings={settings}>
            {children}
          </StoreChrome>
        </CartProvider>
      </body>
    </html>
  );
}
