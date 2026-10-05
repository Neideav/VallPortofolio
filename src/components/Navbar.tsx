"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [coffeeCount, setCoffeeCount] = useState(24);

  useEffect(() => {
    // Check initial dark mode
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const nextDark = !isDark;

    const applyTheme = () => {
      setIsDark(nextDark);
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    };

    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      e &&
      e.currentTarget
    ) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.documentElement.style.setProperty("--vt-x", `${x}px`);
      document.documentElement.style.setProperty("--vt-y", `${y}px`);
      document.documentElement.style.setProperty("--vt-r", `${endRadius}px`);
      document.documentElement.classList.add("vt-disable-anim", "vt-wipe-active");

      const transition = (document as any).startViewTransition(() => {
        applyTheme();
      });

      transition.finished.finally(() => {
        document.documentElement.classList.remove("vt-disable-anim", "vt-wipe-active");
      });
    } else {
      applyTheme();
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className={`nav-bar ${scrolled ? "scrolled" : ""}`}>
        {/* Left: Monogram and Brand */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="nav-left"
          aria-label="Nauval - Home"
        >
          <div className="nav-logo">N</div>
          <div className="nav-brand">NAUVAL</div>
        </a>

        {/* Center: Links */}
        <div className="nav-center">
          <a
            href="#work"
            onClick={(e) => handleNavClick(e, "#work")}
            className="nav-link"
          >
            Work
          </a>
          <a
            href="#what-i-can-do"
            onClick={(e) => handleNavClick(e, "#what-i-can-do")}
            className="nav-link"
          >
            What I Can Do
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, "#about")}
            className="nav-link"
          >
            About
          </a>
          <a
            href="#awards"
            onClick={(e) => handleNavClick(e, "#awards")}
            className="nav-link"
          >
            Awards
          </a>
          <a
            href="#trainings"
            onClick={(e) => handleNavClick(e, "#trainings")}
            className="nav-link"
          >
            Trainings
          </a>
        </div>

        {/* Right: Theme Toggle & Hire Me */}
        <div className="nav-right">
          <button
            onClick={toggleTheme}
            className="nav-theme-toggle"
            aria-label="Toggle theme"
          >
            <Sun className="w-4 h-4 icon-sun" />
            <Moon className="w-4 h-4 icon-moon" />
          </button>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="nav-cta"
          >
            Hire Me
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-inherit flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop & Dropdown */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-4 right-4 z-50 md:hidden p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xl flex flex-col gap-2.5">
            <a
              href="#work"
              onClick={(e) => handleNavClick(e, "#work")}
              className="text-xs font-semibold tracking-wider uppercase py-2.5 border-b border-[var(--line)] flex items-center justify-between"
            >
              <span>Work</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">01</span>
            </a>
            <a
              href="#what-i-can-do"
              onClick={(e) => handleNavClick(e, "#what-i-can-do")}
              className="text-xs font-semibold tracking-wider uppercase py-2.5 border-b border-[var(--line)] flex items-center justify-between"
            >
              <span>What I Can Do</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">02</span>
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "#about")}
              className="text-xs font-semibold tracking-wider uppercase py-2.5 border-b border-[var(--line)] flex items-center justify-between"
            >
              <span>About</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">03</span>
            </a>
            <a
              href="#awards"
              onClick={(e) => handleNavClick(e, "#awards")}
              className="text-xs font-semibold tracking-wider uppercase py-2.5 border-b border-[var(--line)] flex items-center justify-between"
            >
              <span>Awards</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">04</span>
            </a>
            <a
              href="#trainings"
              onClick={(e) => handleNavClick(e, "#trainings")}
              className="text-xs font-semibold tracking-wider uppercase py-2.5 border-b border-[var(--line)] flex items-center justify-between"
            >
              <span>Trainings</span>
              <span className="text-[10px] font-mono text-[var(--muted)]">05</span>
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="text-xs font-semibold tracking-wider uppercase py-2.5 text-emerald-500 font-mono"
            >
              Contact / Hire Me &rarr;
            </a>

            {/* Coffee Button in Menu */}
            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
              <span className="text-xs text-[var(--muted)]">Support creator</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCoffeeCount((prev) => prev + 1);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-2)] text-xs font-mono active:scale-95 transition-transform"
              >
                <span>☕ Buy Coffee</span>
                <span className="text-[11px] text-amber-500 font-bold">{coffeeCount}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
