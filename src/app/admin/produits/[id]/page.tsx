"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconCheck,
} from "@/components/store/Icons";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

interface Form {
  slug: string;
  name: string;
  description: string;
  categoryId: number | null;
  price: string;
  comparePrice: string;
  currency: string;
  stock: string;
  images: string[];
  sizes: string[];
  colors: string[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => {
        const p = (d.products as ProductDTO[]).find(
          (x) => x.id === parseInt(params.id)
        );
        if (p) {
          setForm({
            slug: p.slug,
            name: p.name,
            description: p.description ?? "",
            categoryId: p.categoryId,
            price: String(p.price),
            comparePrice: p.comparePrice ? String(p.comparePrice) : "",
            currency: p.currency,
            stock: String(p.stock),
            images: p.images,
            sizes: p.sizes,
            colors: p.colors,
            tags: p.tags,
            isFeatured: p.isFeatured,
            isActive: p.isActive,
          });
        }
      });
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));
  }, [params.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock) || 0,
      };
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Erreur");
      router.push("/admin/produits");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  if (!form) {
    return <p className="text-neutral-500">Chargement...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/produits"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 hover:border-black"
        >
          <IconArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold">Modifier le produit</h1>
          <p className="text-sm text-neutral-500">{form.name}</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Informations générales</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="admin-label">Nom</span>
                <input
                  required
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="admin-label">Slug</span>
                <input
                  required
                  className="admin-input"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="admin-label">Description</span>
                <textarea
                  rows={4}
                  className="admin-input"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="admin-label">Catégorie</span>
                <select
                  className="admin-input"
                  value={form.categoryId ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoryId: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                >
                  <option value="">— Aucune —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Images</h2>
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;
                  Array.from(files).forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm((f) => f && {
                        ...f,
                        images: [...f.images, reader.result as string],
                      });
                    };
                    reader.readAsDataURL(file);
                  });
                  e.target.value = "";
                }}
                className="admin-input flex-1 file:mr-4 file:rounded-full file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-neutral-200"
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {form.images.map((src, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200"
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) =>
                        f ? { ...f, images: f.images.filter((_, idx) => idx !== i) } : f
                      )
                    }
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 group-hover:opacity-100"
                  >
                    <IconTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Variantes</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <ChipInput
                label="Tailles"
                value={sizeInput}
                onChange={setSizeInput}
                items={form.sizes}
                onAdd={(v) => {
                  setForm((f) => f && { ...f, sizes: [...f.sizes, v] });
                  setSizeInput("");
                }}
                onRemove={(v) =>
                  setForm((f) =>
                    f ? { ...f, sizes: f.sizes.filter((s) => s !== v) } : f
                  )
                }
              />
              <ChipInput
                label="Couleurs"
                value={colorInput}
                onChange={setColorInput}
                items={form.colors}
                onAdd={(v) => {
                  setForm((f) => f && { ...f, colors: [...f.colors, v] });
                  setColorInput("");
                }}
                onRemove={(v) =>
                  setForm((f) =>
                    f ? { ...f, colors: f.colors.filter((s) => s !== v) } : f
                  )
                }
              />
              <ChipInput
                label="Tags"
                value={tagInput}
                onChange={setTagInput}
                items={form.tags}
                onAdd={(v) => {
                  setForm((f) => f && { ...f, tags: [...f.tags, v] });
                  setTagInput("");
                }}
                onRemove={(v) =>
                  setForm((f) =>
                    f ? { ...f, tags: f.tags.filter((s) => s !== v) } : f
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Prix & stock</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="admin-label">Prix (DA)</span>
                <input
                  type="number"
                  className="admin-input"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="admin-label">Prix barré (DA)</span>
                <input
                  type="number"
                  className="admin-input"
                  value={form.comparePrice}
                  onChange={(e) =>
                    setForm({ ...form, comparePrice: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="admin-label">Stock</span>
                <input
                  type="number"
                  className="admin-input"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Visibilité</h2>
            <div className="space-y-3">
              <Toggle
                label="Produit actif"
                value={form.isActive}
                onChange={(v) => setForm({ ...form, isActive: v })}
              />
              <Toggle
                label="Mis en avant"
                value={form.isFeatured}
                onChange={(v) => setForm({ ...form, isFeatured: v })}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="admin-btn justify-center"
            >
              {submitting ? "Enregistrement..." : (
                <>
                  <IconCheck size={16} /> Enregistrer
                </>
              )}
            </button>
            <Link href="/admin/produits" className="admin-btn-outline justify-center">
              Annuler
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

function ChipInput({
  label,
  value,
  onChange,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}) {
  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (value.trim()) onAdd(value.trim());
            }
          }}
        />
        <button
          type="button"
          onClick={() => value.trim() && onAdd(value.trim())}
          className="admin-btn-outline"
        >
          <IconPlus size={14} />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((it) => (
          <span
            key={it}
            className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-sm"
          >
            {it}
            <button
              type="button"
              onClick={() => onRemove(it)}
              className="text-neutral-500 hover:text-red-600"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          value ? "bg-black" : "bg-neutral-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}