import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getCategories } from "@/lib/data";
import { ProductDetail } from "@/components/store/ProductDetail";
import { ProductCard } from "@/components/store/ProductCard";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product: Awaited<ReturnType<typeof getProductBySlug>> = null;
  let related: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    product = await getProductBySlug(slug);
    if (product) {
      related = await getProducts({
        category: product.categorySlug ?? "tout",
        limit: 5,
      });
      related = related.filter((p) => p.id !== product!.id).slice(0, 4);
    }
  } catch {}

  if (!product) {
    // Show friendly empty state instead of 404 for resilience
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl">Produit introuvable</h1>
        <p className="mt-3 text-neutral-500">
          Ce produit n'existe pas ou a été retiré.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-black px-6 py-2.5 text-sm text-white"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const categoryName =
    (await getCategories().catch(() => [] as Awaited<ReturnType<typeof getCategories>>))
      .find((c) => c.id === product.categoryId)?.name ?? "Produit";

  return (
    <div>
      <ProductDetail product={product} categoryName={categoryName} />

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <h2 className="mb-8 font-serif text-2xl font-bold md:text-3xl">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}