"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import {
  IconDashboard,
  IconBox,
  IconTag,
  IconUsers,
  IconMessage,
  IconSettings,
  IconLogout,
  IconDb,
  IconTrend,
  IconStore,
  IconChevronRight,
  IconExternal,
  IconMenu,
  IconClose,
} from "@/components/store/Icons";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: IconDashboard },
  { href: "/admin/produits", label: "Produits", icon: IconBox },
  { href: "/admin/categories", label: "Catégories", icon: IconTag },
  { href: "/admin/commandes", label: "Commandes", icon: IconTrend },
  { href: "/admin/clients", label: "Clients", icon: IconUsers },
  { href: "/admin/messages", label: "Messages", icon: IconMessage },
  { href: "/admin/parametres", label: "Paramètres", icon: IconSettings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("milina_admin") === "1") setAuthed(true);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin1234") {
      sessionStorage.setItem("milina_admin", "1");
      setAuthed(true);
      setError(null);
    } else {
      setError("Mot de passe incorrect");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("milina_admin");
    setAuthed(false);
    router.push("/admin");
  };

  if (!authed) {
    return (
      <div className="admin-root flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-200 p-4">
        <form
          onSubmit={login}
          className="admin-card w-full max-w-md p-8 shadow-xl"
        >
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              <IconStore size={24} />
            </div>
            <h1 className="font-serif text-2xl font-bold">Milina Admin</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Tableau de bord de la boutique
            </p>
          </div>
          <label className="admin-label">Mot de passe</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez le mot de passe admin"
            className="admin-input"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <button type="submit" className="admin-btn mt-5 w-full justify-center">
            Se connecter
          </button>
          <p className="mt-4 text-center text-xs text-neutral-500">
            Démo: <code className="rounded bg-neutral-100 px-1.5 py-0.5">admin1234</code>
          </p>
          <Link
            href="/"
            className="mt-4 block text-center text-xs text-neutral-500 hover:text-black"
          >
            ← Retour à la boutique
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-root flex min-h-screen">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-none transform flex-col border-r border-neutral-200 bg-white transition-transform duration-200 ease-in-out md:sticky md:top-0 md:block md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 p-5">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              <IconStore size={16} />
            </div>
            <div>
              <div className="font-serif text-lg font-bold">Milina</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500">
                Admin
              </div>
            </div>
          </Link>
          <button
            className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <IconClose size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active =
              pathname === n.href ||
              (n.href !== "/admin" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-black text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <Icon size={18} /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-neutral-100 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <IconLogout size={18} /> Déconnexion
          </button>
          <Link
            href="/"
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <IconExternal size={18} /> Voir la boutique
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="-ml-2 mr-1 rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-black"
            >
              <IconMenu size={20} />
            </button>
            <Link href="/" className="font-serif text-lg font-bold">
              Milina
            </Link>
          </div>
          <nav className="no-scrollbar hidden items-center gap-2 overflow-x-auto md:flex">
            {NAV.filter((n) => n.href !== "/admin").slice(0, 4).map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs transition-colors ${
                  pathname?.startsWith(n.href)
                    ? "bg-neutral-100 text-black"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-neutral-500 md:inline">
              Connecté en tant qu'admin
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
              A
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}