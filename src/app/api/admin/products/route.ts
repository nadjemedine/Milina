import { NextRequest } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { adminListProducts } from "@/lib/data";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const list = await adminListProducts();
    return Response.json({ products: list });
  } catch (err) {
    return Response.json({ products: [], error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = JSON.parse(formData.get("payload") as string);
      for (const img of body.images || []) {
        if (img.fileIndex !== undefined) {
          const file = formData.get(`file_${img.fileIndex}`) as File;
          if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const base64 = buffer.toString("base64");
            img.url = `data:${file.type};base64,${base64}`;
          }
          delete img.fileIndex;
        }
      }
    } else {
      body = await req.json();
    }
    const {
      slug,
      name,
      description,
      categoryId,
      price,
      comparePrice,
      currency,
      images,
      sizes,
      variants,
      tags,
      isFeatured,
      isActive,
    } = body ?? {};

    if (!slug || !name || price === undefined) {
      return Response.json(
        { ok: false, error: "Slug, nom et prix requis" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    if (existing.length > 0) {
      return Response.json(
        { ok: false, error: "Un produit avec ce slug existe déjà" },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(products)
      .values({
        slug,
        name,
        description: description ?? null,
        categoryId: categoryId ?? null,
        price: String(price),
        comparePrice: comparePrice ? String(comparePrice) : null,
        currency: currency ?? "DA",
        images: images ?? [],
        sizes: sizes ?? [],
        variants: variants ?? [],
        tags: tags ?? [],
        isFeatured: !!isFeatured,
        isActive: isActive !== false,
      })
      .returning();

    return Response.json({ ok: true, product: inserted });
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}