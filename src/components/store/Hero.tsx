"use client";

import Link from "next/link";
import { IconArrowRight } from "./Icons";

interface Props {
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaHref?: string;
}

export function Hero({ title, subtitle, imageUrl, ctaHref = "/categorie/caftans" }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          {subtitle && (
            <p className="mb-3 text-xs uppercase tracking-[0.4em] md:text-sm">
              {subtitle}
            </p>
          )}
          <h1 className="font-serif text-4xl font-bold uppercase tracking-tight md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-smooth hover:bg-black hover:text-white"
          >
            Shop Now <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}