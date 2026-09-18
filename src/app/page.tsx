import { getProducts, getAllSettings, getCategories } from "@/lib/data";
import { Hero } from "@/components/store/Hero";
import { ProductGrid } from "@/components/store/ProductGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let settings: Awaited<ReturnType<typeof getAllSettings>> = {};
  try {
    [products, settings] = await Promise.all([
      getProducts({ limit: 50 }),
      getAllSettings(),
    ]);
  } catch {
    // DB unavailable in this render — empty state will show
  }

  const heroImage =
    (settings.hero_image as string) ||
    products.find((p) => p.slug === "caftan-le-royal")?.images[0]?.url ||
    "";
  const heroTitle = (settings.hero_title as string) ?? "CAFTAN LE ROYAL";
  const heroSubtitle = (settings.hero_subtitle as string) ?? undefined;

  return (
    <div>
      {heroImage && (
        <Hero
          title={heroTitle}
          subtitle={heroSubtitle}
          imageUrl={heroImage}
          ctaHref="/"
        />
      )}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-8 text-center">
          <div className="typewriter-container">
            <h2 
              className="text-3xl font-bold italic tracking-tight text-gray-900 md:text-4xl"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              Tous les articles
            </h2>
          </div>
          <div className="mx-auto mt-4 h-1 w-20 bg-black"></div>
        </div>
        <ProductGrid products={products} perPage={8} />
      </section>
    </div>
  );
}