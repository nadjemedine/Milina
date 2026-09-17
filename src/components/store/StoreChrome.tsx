"use client";

import { type ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CategoryDTO } from "@/lib/types";
import {
  IconBag,
  IconClose,
  IconHeart,
  IconHome,
  IconInstagram,
  IconFacebook,
  IconMail,
  IconMapPin,
  IconMenu,
  IconSearch,
  IconStore,
  IconWhatsApp,
} from "@/components/store/Icons";
import { Store as LucideStore, ShoppingCart as LucideShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import { CartDrawer } from "./CartDrawer";
import { MenuDrawer } from "./MenuDrawer";
import { SearchBar } from "./SearchBar";

interface Props {
  children: ReactNode;
  categories: CategoryDTO[];
  settings: Record<string, unknown>;
}

export function StoreChrome({ children, categories, settings }: Props) {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const pathname = usePathname();

  const shippingNotice =
    (settings.shipping_notice as string) ?? "Livraison Rapide 58 Wilayas";
  const contactEmail =
    (settings.contact_email as string) ?? "milina.luxury@gmail.com";
  const contactAddress =
    (settings.contact_address as string) ?? "Algerie, Alger";
  const aboutText =
    (settings.about_text as string) ??
    "Milina Luxury est votre boutique en ligne de prêt à porter pour femmes. Chez Milina Luxury, l'originalité est la seule règle. Révélez l'exception qui est en vous !";
  const instagramUrl =
    (settings.instagram_url as string) ?? "https://instagram.com/milina.luxury";
  const facebookUrl =
    (settings.facebook_url as string) ?? "https://facebook.com/milina.luxury";
  const whatsappUrl =
    (settings.whatsapp_url as string) ?? "https://wa.me/213660989407";
  const whatsappVisible =
    settings.whatsapp_visible !== undefined ? settings.whatsapp_visible === true || settings.whatsapp_visible === "true" : true;

  // On admin pages, render minimal layout
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  const announcements = [
    "Bienvenue à boutique Milina Luxury",
    shippingNotice,
    "Paiement à la livraison",
    "Échanges possibles 24h",
  ];

  // Cycle announcements
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const visibleCategories = categories.filter((c) => c.slug !== "tout");
  const navCategories = [
    { slug: "tout", name: "Tout" },
    ...visibleCategories.slice(0, 7).map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white pb-[60px] md:pb-0">
      {/* Announcement bar */}
      <div className="bg-white border-b border-neutral-100">
        <div className="relative flex items-center justify-center overflow-hidden py-2.5">
          {announcements.map((msg, i) => (
            <span
              key={msg}
              className={`absolute inset-x-0 text-center text-base font-bold italic text-black transition-all duration-500 ${
                i === announcementIdx
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ fontFamily: "'Amiri', serif" }}
            >
              {msg}
            </span>
          ))}
          {/* invisible spacer */}
          <span className="invisible text-base font-bold italic" style={{ fontFamily: "'Amiri', serif" }}>
            {announcements[0]}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-full p-2 transition-smooth hover:bg-neutral-100"
            >
              <IconMenu size={22} />
            </button>
            <button
              type="button"
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 transition-smooth hover:bg-neutral-100"
            >
              <IconSearch size={20} />
            </button>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 transform flex items-center justify-center"
          >
            {(settings.logo_image as string) ? (
              <img src={settings.logo_image as string} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
            ) : null}
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/favoris"
              aria-label="Favoris"
              className="rounded-full p-2 transition-smooth hover:bg-neutral-100"
            >
              <IconHeart size={20} />
            </Link>
            <button
              type="button"
              aria-label="Panier"
              onClick={openCart}
              className="relative rounded-full p-2 transition-smooth hover:bg-neutral-100"
            >
              <IconBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="border-t border-neutral-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3">
              {navCategories.map((c) => {
                const isActive =
                  pathname === "/" && c.slug === "tout"
                    ? true
                    : pathname === `/categorie/${c.slug}`;
                return (
                  <Link
                    key={c.slug}
                    href={c.slug === "tout" ? "/" : `/categorie/${c.slug}`}
                    className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-smooth ${
                      isActive
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 text-neutral-700 hover:border-black hover:text-black"
                    }`}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl">Rechercher</h2>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setSearchOpen(false)}
                className="rounded-full p-2 hover:bg-neutral-100"
              >
                <IconClose />
              </button>
            </div>
            <SearchBar onResultClick={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Menu drawer */}
      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={categories}
      />

      {/* Cart drawer */}
      <CartDrawer />

      <main className="flex-1">{children}</main>

      {/* Features section */}
      <section className="border-t border-neutral-100 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <IconStore size={36} />,
              title: "Livraison rapide",
              desc: "Nous livrons rapidement partout en Algérie",
            },
            {
              icon: <IconBag size={36} />,
              title: "Paiement à la livraison",
              desc: "Payez en toute sécurité à la livraison",
            },
            {
              icon: (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7.5 21 3 16.5l4.5-4.5" />
                  <path d="M16.5 3 21 7.5l-4.5 4.5" />
                  <line x1="3" y1="16.5" x2="16.5" y2="3" />
                </svg>
              ),
              title: "Échanges possibles",
              desc: "Les échanges sont possibles dans les 24 heures",
            },
            {
              icon: <IconMapPin size={36} />,
              title: "Suivi de vos commandes",
              desc: "Nous suivons vos commandes jusqu'à la livraison",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center rounded-2xl border border-neutral-100 bg-white p-6 text-center transition-smooth hover:border-neutral-300 hover:shadow-sm"
            >
              <div className="mb-4 text-black">{f.icon}</div>
              <h3 className="text-base font-semibold text-black">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-8">
          <div className="mb-8 flex justify-center">
            {(settings.footer_logo_image as string) ? (
              <img src={settings.footer_logo_image as string} alt="Footer Logo" className="h-16 w-auto object-contain" />
            ) : null}
          </div>
          <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-black">
            À propos
          </h3>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600">
            {aboutText}
          </p>
          <Link
            href="/cgu"
            className="mt-6 inline-block font-bold text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline"
          >
            Conditions Générales De Vente
          </Link>

          <h3 className="mt-12 text-xs font-bold uppercase tracking-[0.4em] text-black">
            Contact
          </h3>
          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-neutral-700">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 hover:text-black"
            >
              <IconMail size={16} /> {contactEmail}
            </a>
            <div className="inline-flex items-center gap-2">
              <IconMapPin size={16} /> {contactAddress}
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white transition-smooth hover:scale-105"
              >
                <IconInstagram size={18} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-smooth hover:scale-105"
              >
                <IconFacebook size={18} />
              </a>
            </div>
          </div>

          <div className="mt-12 border-t border-neutral-100 pt-6 text-xs font-bold text-black">
            © {new Date().getFullYear()} Milina Luxury · Tous droits réservés
          </div>
          <a
            href="https://www.instagram.com/ne__dev"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-xs font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Développé par Ne__dev
          </a>
        </div>
      </footer>

      {/* WhatsApp floating button */}
      {whatsappVisible && whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-green-200/40 active:scale-95 md:bottom-8 md:left-8 bottom-[76px] left-4"
          style={{ animation: 'whatsapp-pulse 2s ease-in-out infinite' }}
        >
          <IconWhatsApp size={28} />
        </a>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-neutral-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        <Link href="/" className="group flex flex-col items-center gap-1 text-black transition-all active:scale-95">
          <LucideStore size={22} strokeWidth={1.5} className="transition-transform group-hover:-translate-y-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Boutique</span>
        </Link>
        <Link href="/commander" className="group flex flex-col items-center gap-1 text-black transition-all active:scale-95">
          <div className="relative transition-transform group-hover:-translate-y-0.5">
            <LucideShoppingCart size={22} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Panier</span>
        </Link>
      </nav>
    </div>
  );
}