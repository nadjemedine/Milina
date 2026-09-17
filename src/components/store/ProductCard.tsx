"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductDTO } from "@/lib/types";
import { useCart } from "./CartProvider";
import { IconHeart, IconBag } from "./Icons";
import { QuickAddSheet } from "./QuickAddSheet";

interface Props {
  product: ProductDTO;
  priority?: boolean;
}

export function ProductCard({ product, priority }: Props) {
  const { toggleFavorite, isFavorite } = useCart();
  const [sheetOpen, setSheetOpen] = useState(false);
  const fav = isFavorite(product.slug);
  const onSale =
    product.comparePrice !== null && product.comparePrice > product.price;
  const discount = onSale
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  return (
    <article className="group fade-in">
      <div className="zoom-container relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100">
        <Link href={`/produit/${product.slug}`} aria-label={product.name}>
          <img
            src={product.images[0] ?? ""}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="zoom-img h-full w-full object-cover"
          />
        </Link>

        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            -{discount}%
          </span>
        )}

        {/* Hover icons */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
            onClick={() => toggleFavorite(product.slug)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-black transition-smooth hover:scale-110 hover:bg-black hover:text-white"
          >
            <IconHeart size={16} filled={fav} />
          </button>
          <button
            type="button"
            aria-label="Ajouter au panier"
            onClick={() => setSheetOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-black transition-smooth hover:scale-110 hover:bg-black hover:text-white"
          >
            <IconBag size={16} />
          </button>
        </div>

        {/* Quick add (mobile) */}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="absolute bottom-3 left-3 right-3 rounded-full bg-white/95 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black opacity-0 shadow-lg transition-smooth hover:bg-black hover:text-white group-hover:opacity-100 md:hidden"
        >
          Ajouter au panier
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <Link href={`/produit/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-1 text-sm font-medium uppercase tracking-wider text-black transition-smooth hover:underline">
            {product.name}
          </h3>
          {product.colors.length > 0 && (
            <p className="mt-0.5 text-xs text-neutral-500">
              {product.colors.join(" · ")}
            </p>
          )}
        </Link>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-base font-bold text-black">
          {product.price.toLocaleString("fr-DZ")} {product.currency}
        </span>
        {onSale && (
          <span className="text-sm text-neutral-400 line-through">
            {product.comparePrice!.toLocaleString("fr-DZ")} {product.currency}
          </span>
        )}
      </div>

      {/* Quick-add bottom sheet */}
      <QuickAddSheet
        product={product}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </article>
  );
}