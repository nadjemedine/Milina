"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconCheck,
} from "@/components/store/Icons";
import type { CategoryDTO, ProductImage, ProductVariant } from "@/lib/types";

interface Form {
  slug: string;
  name: string;
  description: string;
  categoryId: number | null;
  price: string;
  comparePrice: string;
  currency: string;
  images: ProductImage[];
  sizes: string[];
  variants: ProductVariant[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
}

const EMPTY: Form = {
  slug: "",
  name: "",
  description: "",
  categoryId: null,
  price: "",
  comparePrice: "",
  currency: "DA",
  images: [],
  sizes: [],
  variants: [],
  tags: [],
  isFeatured: false,
  isActive: true,
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>(EMPTY);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imageColorInput, setImageColorInput] = useState("");
  const [variantColor, setVariantColor] = useState("");
  const [variantSize, setVariantSize] = useState("");
  const [variantQty, setVariantQty] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => {
      setCategories(d.categories ?? []);
    });
  }, []);

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Extract unique colors from images
  const imageColors = [...new Set(form.images.map((img) => img.color).filter(Boolean))];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: parseFloat(form.price) || 0,
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
    };
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
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

  const addVariant = () => {
    const c = variantColor.trim();
    const s = variantSize.trim();
    const q = parseInt(variantQty) || 0;
    if (!c || !s) return;
    // Check if variant already exists
    const exists = form.variants.some((v) => v.color === c && v.size === s);
    if (exists) return;
    setForm((f) => ({ ...f, variants: [...f.variants, { color: c, size: s, quantity: q }] }));
    setVariantQty("");
  };

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
          <h1 className="font-serif text-3xl font-bold">Nouveau produit</h1>
          <p className="text-sm text-neutral-500">
            Ajoutez un nouvel article à votre catalogue
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Informations générales</h2>
            <div className="space-y-4">
              <Field label="Nom du produit *">
                <input
                  required
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug: f.slug || slugify(e.target.value),
                    }));
                  }}
                />
              </Field>
              <Field label="Slug (URL) *">
                <input
                  required
                  className="admin-input"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={4}
                  className="admin-input"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Field>
              <Field label="Catégorie">
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
              </Field>
            </div>
          </div>

          {/* Images with color linking */}
          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Images & Couleurs</h2>
            <p className="mb-3 text-xs text-neutral-500">
              Chaque image est associée à une couleur. Entrez le nom de la couleur puis choisissez les images.
            </p>
            <div className="flex gap-2 mb-4">
              <input
                placeholder="Nom de la couleur (ex: Noir, Beige...)"
                value={imageColorInput}
                onChange={(e) => setImageColorInput(e.target.value)}
                className="admin-input flex-1"
              />
              <label className="admin-btn-outline cursor-pointer whitespace-nowrap">
                <IconPlus size={14} />
                <span className="ml-1">Ajouter images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    const color = imageColorInput.trim();
                    if (!files || !color) {
                      alert("Veuillez entrer le nom de la couleur d'abord");
                      return;
                    }
                    Array.from(files).forEach((file) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm((f) => ({
                          ...f,
                          images: [...f.images, { url: reader.result as string, color }],
                        }));
                      };
                      reader.readAsDataURL(file);
                    });
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {/* Group images by color */}
            {imageColors.length > 0 && (
              <div className="space-y-4">
                {imageColors.map((color) => {
                  const colorImages = form.images
                    .map((img, idx) => ({ ...img, idx }))
                    .filter((img) => img.color === color);
                  return (
                    <div key={color} className="rounded-lg border border-neutral-100 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold">{color}</span>
                        <span className="text-xs text-neutral-400">{colorImages.length} image(s)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                        {colorImages.map((img) => (
                          <div
                            key={img.idx}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200"
                          >
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() =>
                                setForm((f) => ({
                                  ...f,
                                  images: f.images.filter((_, i) => i !== img.idx),
                                }))
                              }
                              className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 group-hover:opacity-100"
                            >
                              <IconTrash size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Variants: Tailles & Tags */}
          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Tailles & Tags</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <ChipInput
                label="Tailles (S, M, L...)"
                value={sizeInput}
                onChange={setSizeInput}
                items={form.sizes}
                onAdd={(v) => {
                  setForm((f) => ({ ...f, sizes: [...f.sizes, v] }));
                  setSizeInput("");
                }}
                onRemove={(v) =>
                  setForm((f) => ({
                    ...f,
                    sizes: f.sizes.filter((s) => s !== v),
                  }))
                }
              />
              <ChipInput
                label="Tags (nouveau, solde...)"
                value={tagInput}
                onChange={setTagInput}
                items={form.tags}
                onAdd={(v) => {
                  setForm((f) => ({ ...f, tags: [...f.tags, v] }));
                  setTagInput("");
                }}
                onRemove={(v) =>
                  setForm((f) => ({
                    ...f,
                    tags: f.tags.filter((s) => s !== v),
                  }))
                }
              />
            </div>
          </div>

          {/* Stock per variant */}
          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Stock par variante (Couleur + Taille)</h2>
            <p className="mb-3 text-xs text-neutral-500">
              Définissez la quantité disponible pour chaque combinaison couleur + taille.
            </p>

            <div className="flex flex-wrap items-end gap-2 mb-4">
              <div className="flex-1 min-w-[120px]">
                <span className="admin-label">Couleur</span>
                <select
                  className="admin-input"
                  value={variantColor}
                  onChange={(e) => setVariantColor(e.target.value)}
                >
                  <option value="">— Choisir —</option>
                  {imageColors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <span className="admin-label">Taille</span>
                <select
                  className="admin-input"
                  value={variantSize}
                  onChange={(e) => setVariantSize(e.target.value)}
                >
                  <option value="">— Choisir —</option>
                  {form.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <span className="admin-label">Quantité</span>
                <input
                  type="number"
                  min={0}
                  className="admin-input"
                  value={variantQty}
                  onChange={(e) => setVariantQty(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addVariant(); }
                  }}
                />
              </div>
              <button type="button" onClick={addVariant} className="admin-btn-outline h-[42px]">
                <IconPlus size={14} />
              </button>
            </div>

            {/* Auto-generate all combinations button */}
            {imageColors.length > 0 && form.sizes.length > 0 && (
              <button
                type="button"
                className="mb-4 text-xs text-blue-600 hover:underline"
                onClick={() => {
                  const newVariants: ProductVariant[] = [];
                  for (const c of imageColors) {
                    for (const s of form.sizes) {
                      if (!form.variants.some((v) => v.color === c && v.size === s)) {
                        newVariants.push({ color: c, size: s, quantity: 0 });
                      }
                    }
                  }
                  if (newVariants.length > 0) {
                    setForm((f) => ({ ...f, variants: [...f.variants, ...newVariants] }));
                  }
                }}
              >
                ✦ Générer toutes les combinaisons manquantes
              </button>
            )}

            {form.variants.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-neutral-100">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Couleur</th>
                      <th>Taille</th>
                      <th>Quantité</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.variants.map((v, i) => (
                      <tr key={`${v.color}-${v.size}`}>
                        <td className="font-medium">{v.color}</td>
                        <td>{v.size}</td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            className="admin-input w-20"
                            value={v.quantity}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value) || 0;
                              setForm((f) => ({
                                ...f,
                                variants: f.variants.map((vr, vi) =>
                                  vi === i ? { ...vr, quantity: qty } : vr
                                ),
                              }));
                            }}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                variants: f.variants.filter((_, vi) => vi !== i),
                              }))
                            }
                            className="rounded p-1 text-red-500 hover:bg-red-50"
                          >
                            <IconTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {form.variants.length > 0 && (
              <p className="mt-2 text-xs text-neutral-500">
                Stock total : {form.variants.reduce((s, v) => s + v.quantity, 0)} unités
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Prix</h2>
            <div className="space-y-4">
              <Field label="Prix (DA) *">
                <input
                  type="number"
                  required
                  min={0}
                  step="0.01"
                  className="admin-input"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </Field>
              <Field label="Prix barré (DA)">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="admin-input"
                  value={form.comparePrice}
                  onChange={(e) =>
                    setForm({ ...form, comparePrice: e.target.value })
                  }
                />
              </Field>
            </div>
          </div>

          <div className="admin-card p-5">
            <h2 className="mb-4 font-semibold">Visibilité</h2>
            <div className="space-y-3">
              <Toggle
                label="Produit actif"
                desc="Affiché sur la boutique"
                value={form.isActive}
                onChange={(v) => setForm({ ...form, isActive: v })}
              />
              <Toggle
                label="Mis en avant"
                desc="Affiché sur la page d'accueil"
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
              {submitting ? (
                "Création..."
              ) : (
                <>
                  <IconCheck size={16} /> Créer le produit
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
    </label>
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
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <div>
        <div className="text-sm font-medium text-black">{label}</div>
        <div className="text-xs text-neutral-500">{desc}</div>
      </div>
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