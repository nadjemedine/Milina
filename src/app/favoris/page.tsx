"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProductDTO } from "@/lib/types";
import { useCart } from "@/components/store/CartProvider";
import { ProductCard } from "@/components/store/ProductCard";
import { IconHeart } from "@/components/store/Icons";

export default function FavoritesPage() {
  const { favorites } = useCart();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all(
      favorites.map((slug) =>
        fetch(`/api/products?search=&slug=${encodeURIComponent(slug)}`)
          .then((r) => r.json())
          .catch(() => null)
      )
    ).then(async () => {
      // easier: fetch all products and filter
      const r = await fetch("/api/products");
      const data = await r.json();
      if (mounted) {
        setProducts(
          (data.products ?? []).filter((p: ProductDTO) =>
            favorites.includes(p.slug)
          )
        );
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [favorites]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
      <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
        Vos favoris
      </h1>

      {favorites.length === 0 ? (
        <div className="mt-16">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
            <IconHeart size={36} />
          </div>
          <h2 className="mt-8 text-2xl font-semibold">
            Aucun favori pour le moment
          </h2>
          <p className="mx-auto mt-3 max-w-md text-neutral-500">
            Parcourez notre boutique et cliquez sur le cœur pour ajouter des
            articles à vos favoris.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-smooth hover:border-black hover:bg-black hover:text-white"
          >
            Continuer vos achats
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 text-left md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}