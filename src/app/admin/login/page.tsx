"use client";

import Link from "next/link";
import { IconStore } from "@/components/store/Icons";
import { useActionState, useEffect, useState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white selection:bg-white/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-white/5 blur-[100px]" />
      </div>

      <div
        className={`relative z-10 w-full max-w-md p-8 transition-all duration-1000 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        <div className="mb-12 flex flex-col items-center">
          {/* Logo Placeholder - Will display /logo.png once added to the store */}
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-16 w-auto object-contain transition-transform duration-500 hover:scale-105" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <p className="mt-4 text-sm tracking-widest text-white/50 uppercase">
            Accès Sécurisé
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div
            className={`transition-all duration-700 delay-100 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="group relative pt-6">
              <input
                id="email"
                name="email"
                type="email"
                autoFocus
                required
                placeholder=" "
                className="peer w-full border-b border-white/20 bg-transparent px-0 py-2 text-sm text-white placeholder-transparent transition-colors focus:border-white focus:outline-none focus:ring-0"
                style={{ WebkitBoxShadow: "0 0 0px 1000px #000 inset", WebkitTextFillColor: "#fff" }}
              />
              <label
                htmlFor="email"
                className="absolute left-0 top-1 text-xs text-white/50 transition-all peer-placeholder-shown:top-8 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-white"
              >
                Adresse e-mail
              </label>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="group relative flex items-center pt-6">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder=" "
                className="peer w-full border-b border-white/20 bg-transparent px-0 py-2 pr-10 text-sm text-white placeholder-transparent transition-colors focus:border-white focus:outline-none focus:ring-0"
                style={{ WebkitBoxShadow: "0 0 0px 1000px #000 inset", WebkitTextFillColor: "#fff" }}
              />
              <label
                htmlFor="password"
                className="absolute left-0 top-1 text-xs text-white/50 transition-all peer-placeholder-shown:top-8 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-white"
              >
                Mot de passe
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-6 p-2 text-white/50 hover:text-white focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {state?.error && (
              <p className="mb-4 text-center text-sm font-light text-red-400">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-medium tracking-wide text-black transition-all hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span
                className={`transition-opacity duration-300 ${
                  isPending ? "opacity-0" : "opacity-100"
                }`}
              >
                Connexion
              </span>
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                </div>
              )}
            </button>
          </div>
        </form>

        <div
          className={`mt-8 transition-all duration-700 delay-500 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <Link
            href="/"
            className="group flex items-center justify-center gap-2 text-xs text-white/40 transition-colors hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
