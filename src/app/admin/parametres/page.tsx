"use client";

import { useEffect, useState } from "react";
import { IconCheck, IconTrash } from "@/components/store/Icons";

const FIELDS = [
  { key: "site_name", label: "Nom du site", type: "text" },
  { key: "site_tagline", label: "Slogan", type: "text" },
  { key: "shipping_notice", label: "Bandeau d'annonce", type: "text" },
  { key: "hero_title", label: "Titre Hero", type: "text" },
  { key: "hero_subtitle", label: "Sous-titre Hero", type: "text" },
  { key: "contact_email", label: "Email de contact", type: "email" },
  { key: "contact_phone", label: "Téléphone", type: "tel" },
  { key: "contact_address", label: "Adresse", type: "text" },
  { key: "instagram_url", label: "Instagram URL", type: "url" },
  { key: "facebook_url", label: "Facebook URL", type: "url" },
  { key: "whatsapp_url", label: "WhatsApp URL (ex: https://wa.me/213xxxxxxxxx)", type: "url" },
  { key: "about_text", label: "Texte 'À propos'", type: "textarea" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        const normalized: Record<string, string> = {};
        for (const [k, v] of Object.entries(d.settings ?? {})) {
          normalized[k] =
            typeof v === "string" ? v : v ? JSON.stringify(v) : "";
        }
        setSettings(normalized);
        setLoading(false);
      });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Paramètres</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Personnalisez votre boutique Milina Luxury
        </p>
      </div>

      {loading ? (
        <p className="text-neutral-500">Chargement...</p>
      ) : (
        <form onSubmit={save} className="admin-card p-6">
          <div className="grid gap-5 md:grid-cols-2">
            {FIELDS.map((f) => (
              <label
                key={f.key}
                className={`block ${f.type === "textarea" ? "md:col-span-2" : ""}`}
              >
                <span className="admin-label">{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={settings[f.key] ?? ""}
                    onChange={(e) =>
                      setSettings({ ...settings, [f.key]: e.target.value })
                    }
                    className="admin-input"
                  />
                ) : (
                  <input
                    type={f.type}
                    value={settings[f.key] ?? ""}
                    onChange={(e) =>
                      setSettings({ ...settings, [f.key]: e.target.value })
                    }
                    className="admin-input"
                  />
                )}
              </label>
            ))}
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-6">
            <h2 className="mb-4 font-serif text-xl font-bold">Images & Logos</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <ImageField
                label="Image du Hero"
                value={settings["hero_image"] ?? ""}
                onChange={(v) => setSettings({ ...settings, hero_image: v })}
              />
              <ImageField
                label="Logo principal"
                value={settings["logo_image"] ?? ""}
                onChange={(v) => setSettings({ ...settings, logo_image: v })}
              />
              <ImageField
                label="Logo du footer"
                value={settings["footer_logo_image"] ?? ""}
                onChange={(v) => setSettings({ ...settings, footer_logo_image: v })}
              />
              <ImageField
                label="Favicon (Icône de l'onglet)"
                value={settings["favicon_image"] ?? ""}
                onChange={(v) => setSettings({ ...settings, favicon_image: v })}
              />
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-6">
            <h2 className="mb-4 font-serif text-xl font-bold">WhatsApp</h2>
            <div className="flex items-center gap-4">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={settings["whatsapp_visible"] === "true"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      whatsapp_visible: e.target.checked ? "true" : "false",
                    })
                  }
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-[#25D366] peer-checked:after:translate-x-full" />
              </label>
              <span className="text-sm text-neutral-700">
                {settings["whatsapp_visible"] === "true"
                  ? "Icône WhatsApp visible sur le site"
                  : "Icône WhatsApp masquée"}
              </span>
            </div>
            <p className="mt-2 text-xs text-neutral-400">
              L&apos;icône flottante WhatsApp s&apos;affichera en bas à droite du site lorsqu&apos;elle est activée et qu&apos;une URL WhatsApp est configurée ci-dessus.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-5">
            <button type="submit" disabled={saving} className="admin-btn">
              {saving ? "Enregistrement..." : (
                <>
                  <IconCheck size={16} /> Enregistrer
                </>
              )}
            </button>
            {saved && (
              <span className="text-sm text-green-600">
                Paramètres enregistrés ✓
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onloadend = () => {
              onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
            e.target.value = "";
          }}
          className="admin-input flex-1 file:mr-4 file:rounded-full file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-neutral-200"
        />
        {value && (
          <div className="group relative mt-2 h-24 w-auto self-start overflow-hidden rounded border border-neutral-200 bg-neutral-50 flex items-center justify-center p-2">
            <img src={value} alt="" className="h-full w-auto object-contain" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 group-hover:opacity-100 shadow"
            >
              <IconTrash size={14} />
            </button>
          </div>
        )}
      </div>
    </label>
  );
}
