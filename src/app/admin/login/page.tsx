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
  Loader2 
} from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // If already logged in, redirect straight to /admin
  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            router.replace("/admin");
            return;
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
          setErrorMessage("Email atau password salah. Akses ditolak.");
        } else {
          setErrorMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.session) {
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
      <div className="min-h-screen bg-[#070b12] text-zinc-200 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090e] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors duration-200 bg-zinc-900/60 border border-zinc-800/80 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-8 sm:p-10 shadow-2xl relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              VallPortofolio CMS
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Portal autentikasi khusus pemilik portofolio. Pengunjung tidak memiliki izin akses atau modifikasi.
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1 leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-2">
                Email Pemilik
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nvaldymaulana@gmail.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/70 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-2">
                Password Admin
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/70 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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

          <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Dilindungi oleh PostgreSQL Row-Level-Security (RLS) & Supabase Authentication. Semua pembaruan langsung disinkronkan ke cloud database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
