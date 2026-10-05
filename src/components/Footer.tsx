"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [coffeeCount, setCoffeeCount] = useState(24);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="footer border-t border-[var(--line)] py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <button
            onClick={() => setCoffeeCount((c) => c + 1)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--text)] text-xs font-mono transition-all active:scale-95 text-[var(--text)]"
            title="Buy Nauval a coffee"
          >
            <span>☕ Buy me a coffee</span>
            <span className="text-[11px] text-amber-500 font-bold">{coffeeCount}</span>
          </button>
          <div className="space-y-1.5">
            <div className="font-mono text-xs tracking-widest uppercase text-[var(--muted)]">
              &copy; 2026 MUHAMMAD BAHRUDDIN NAUVALDY MAULANA. ALL RIGHTS RESERVED.
            </div>
            <div className="font-mono text-[11px] text-[var(--muted)] opacity-70">
              Cloud Engineer · Backend Developer · DevOps Engineer · Built with Next.js, TypeScript &amp; Tailwind CSS
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button matching reference */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </>
  );
}
