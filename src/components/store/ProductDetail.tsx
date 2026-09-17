"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductDTO } from "@/lib/types";
import { useCart } from "./CartProvider";
import {
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconBag,
  IconHome,
  IconCheck,
} from "./Icons";

interface Props {
  product: ProductDTO;
  categoryName: string;
}

export function ProductDetail({ product, categoryName }: Props) {
  const { addItem, toggleFavorite, isFavorite } = useCart();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | undefined>(product.sizes[0]);
  const [color, setColor] = useState<string | undefined>(product.colors[0]);
  const fav = isFavorite(product.slug);

  const onSale =
    product.comparePrice !== null && product.comparePrice > product.price;
  const discount = onSale
    ? Math.round(
        ((product.comparePrice! - product.price) / product.comparePrice!) * 100
      )
    : 0;

  const next = () =>
    setActive((a) => (a + 1) % Math.max(1, product.images.length));
  const prev = () =>
    setActive((a) =>
      (a - 1 + product.images.length) % Math.max(1, product.images.length)
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Retour"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition-smooth hover:border-black"
        >
          <IconChevronLeft size={18} />
        </Link>
        <h1 className="font-serif text-xl font-bold uppercase tracking-wide md:hidden">
          {product.name}
        </h1>
        <button
          type="button"
          onClick={() => toggleFavorite(product.slug)}
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition-smooth hover:border-black"
        >
          <IconHeart size={18} filled={fav} />
        </button>
      </div>

      {/* Breadcrumb */}
      <nav className="mb-4 hidden items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 md:flex">
        <Link href="/" className="hover:text-black">
          Accueil
        </Link>
        <IconChevronRight size={12} />
        <Link
          href={
            product.categorySlug ? `/categorie/${product.categorySlug}` : "#"
          }
          className="hover:text-black"
        >
          {categoryName}
        </Link>
        <IconChevronRight size={12} />
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image gallery */}
        <div className="relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100">
            <img
              src={product.images[active] ?? ""}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {onSale && (
              <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                -{discount}% Réduction
              </span>
            )}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Image précédente"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                >
                  <IconChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Image suivante"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                >
                  <IconChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-16 w-16 flex-none overflow-hidden rounded-md border-2 transition-smooth ${
                    active === i ? "border-black" : "border-transparent"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Catégorie : {categoryName}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-black">
              {product.price.toLocaleString("fr-DZ")} {product.currency}
            </span>
            {onSale && (
              <>
                <span className="text-base text-neutral-400 line-through">
                  {product.comparePrice!.toLocaleString("fr-DZ")}{" "}
                  {product.currency}
                </span>
                <span className="rounded-full bg-black px-2.5 py-0.5 text-xs font-semibold text-white">
                  -{discount}% Réduction
                </span>
              </>
            )}
          </div>

          {product.description && (
            <p className="mt-5 text-neutral-600">{product.description}</p>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Taille
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`rounded-md border px-4 py-2 text-sm transition-smooth ${
                      size === s
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Couleur : <span className="text-black">{color}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`rounded-md border px-4 py-2 text-sm transition-smooth ${
                      color === c
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 hover:border-black"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => addItem(product, { size, color })}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-smooth hover:bg-neutral-800"
            >
              <IconBag size={18} /> Ajouter au panier
            </button>
            <button
              type="button"
              onClick={() => {
                addItem(product, { size, color, silent: true });
                window.location.href = "/commander";
              }}
              className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider transition-smooth hover:border-black"
            >
              <IconCheck size={18} />
              Commander
            </button>
          </div>

          {/* Trust badges */}
          <ul className="mt-8 space-y-3 border-t border-neutral-100 pt-6 text-sm text-neutral-700">
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-black">
                <IconCheck size={16} />
              </span>
              Livraison rapide 58 wilayas
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-black">
                <IconCheck size={16} />
              </span>
              Paiement à la livraison
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-black">
                <IconCheck size={16} />
              </span>
              Échanges possibles sous 24h
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}