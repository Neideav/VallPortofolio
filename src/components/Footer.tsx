"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

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
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="font-mono text-xs tracking-widest uppercase text-[var(--muted)]">
            &copy; 2026 MUHAMMAD BAHRUDDIN NAUVALDY MAULANA. ALL RIGHTS RESERVED.
          </div>
          <div className="font-mono text-[11px] text-[var(--muted)] opacity-70">
            Cloud Engineer · Backend Developer · DevOps Engineer · Built with Next.js, TypeScript &amp; Tailwind CSS
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
