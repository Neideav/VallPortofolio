"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  Sun,
  Moon
} from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { BackgroundLines } from "@/components/BackgroundLines";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  const toggleTheme = () => {
    const next = !isDarkTheme;
    setIsDarkTheme(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // If already logged in, redirect straight to /admin if authorized
  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const appMeta = (session.user.app_metadata || {}) as Record<string, unknown>;
            const isRoleAdmin = appMeta.role === "admin" || appMeta.is_admin === true;
            const isEmailOwner = session.user.email?.toLowerCase() === "nvaldymaulana@gmail.com";
            if (isRoleAdmin || isEmailOwner) {
              router.replace("/admin");
              return;
            }
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Mohon masukkan email dan password admin.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        "Koneksi Supabase belum dikonfigurasi. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah disetel di .env.local atau Vercel."
      );
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage("Klien Supabase gagal diinisialisasi.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage(
            "Email atau password tidak cocok, atau akun belum dikonfirmasi di Supabase. Pastikan status akun sudah 'Confirmed' di Supabase Dashboard."
          );
        } else {
          setErrorMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.session) {
        const appMeta = (data.session.user.app_metadata || {}) as Record<string, unknown>;
        const isRoleAdmin = appMeta.role === "admin" || appMeta.is_admin === true;
        const isEmailOwner = data.session.user.email?.toLowerCase() === "nvaldymaulana@gmail.com";

        if (!isRoleAdmin && !isEmailOwner) {
          await supabase.auth.signOut();
          setErrorMessage("Akun ini terdaftar namun tidak memiliki hak akses administrator.");
          setIsLoading(false);
          return;
        }

        router.replace("/admin");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat otentikasi.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text)]" />
      </div>
    );
  }

  return (
    <div className="portfolio-root relative min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-center items-center px-4 font-sans transition-colors duration-400 overflow-hidden">
      {/* Background SVG curved topographic lines */}
      <BackgroundLines />

      {/* Top action controls */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--line)] hover:border-[var(--text)]/40 px-4 py-2 rounded-full shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ke Website</span>
        </Link>

        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="w-10 h-10 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--line)] hover:border-[var(--text)]/40 text-[var(--text)] flex items-center justify-center shadow-sm transition-all cursor-pointer"
        >
          {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-800" />}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 my-16">
        {/* Card Container matching .award-card & .contact-card */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-8 sm:p-10 shadow-2xl relative text-[var(--text)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--text)] shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="section-label mb-2">{"// RESTRICTED ACCESS"}</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)] mb-2">
              CMS Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Portal autentikasi pemilik portofolio untuk mengelola konten, repositori, dan pesan.
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                Email Pemilik
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nvaldymaulana@gmail.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--muted)] mb-2">
                Password Admin
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[var(--surface-2)] border border-[var(--line)] focus:border-[var(--text)] rounded-xl text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] focus:outline-none cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 px-6 rounded-full bg-[var(--text)] text-[var(--surface)] hover:opacity-90 font-mono text-xs uppercase tracking-wider font-bold shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard Admin</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--line)] text-center">
            <p className="text-[11px] font-mono text-[var(--muted)] leading-relaxed">
              Dilindungi oleh PostgreSQL RLS &amp; Supabase Authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
