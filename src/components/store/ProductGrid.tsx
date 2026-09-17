"use client";

import { useState, useEffect } from "react";
import type { ProductDTO } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { IconChevronLeft, IconChevronRight } from "./Icons";

interface Props {
  products: ProductDTO[];
  perPage?: number;
}

export function ProductGrid({ products, perPage = 6 }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const slice = products.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [products.length]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center">
        <p className="text-lg font-medium">Aucun produit</p>
        <p className="mt-2 text-sm text-neutral-500">
          Aucun produit ne correspond à votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
        {slice.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 2} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Précédent"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition-smooth hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            <IconChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-smooth ${
                  page === n
                    ? "bg-black text-white"
                    : "border border-neutral-200 hover:border-black"
                }`}
              >
                {n}
              </button>
            );
          })}
          <button
            type="button"
            aria-label="Suivant"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition-smooth hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            <IconChevronRight size={18} />
          </button>
        </nav>
      )}

      {totalPages > 1 && (
        <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-neutral-400">
          Page {page} sur {totalPages} — {products.length} articles
        </p>
      )}
    </div>
  );
}