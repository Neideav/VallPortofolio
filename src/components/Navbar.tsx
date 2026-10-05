"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

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

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
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
        <div className="nav-center hidden md:flex">
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
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-800" />
            )}
          </button>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="nav-cta hidden md:block"
          >
            Hire Me
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-inherit"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-24 left-4 right-4 z-50 md:hidden p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xl flex flex-col gap-3">
          <a
            href="#work"
            onClick={(e) => handleNavClick(e, "#work")}
            className="text-sm font-semibold tracking-wider uppercase py-2 border-b border-[var(--line)]"
          >
            Work
          </a>
          <a
            href="#what-i-can-do"
            onClick={(e) => handleNavClick(e, "#what-i-can-do")}
            className="text-sm font-semibold tracking-wider uppercase py-2 border-b border-[var(--line)]"
          >
            What I Can Do
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, "#about")}
            className="text-sm font-semibold tracking-wider uppercase py-2 border-b border-[var(--line)]"
          >
            About
          </a>
          <a
            href="#awards"
            onClick={(e) => handleNavClick(e, "#awards")}
            className="text-sm font-semibold tracking-wider uppercase py-2 border-b border-[var(--line)]"
          >
            Awards
          </a>
          <a
            href="#trainings"
            onClick={(e) => handleNavClick(e, "#trainings")}
            className="text-sm font-semibold tracking-wider uppercase py-2 border-b border-[var(--line)]"
          >
            Trainings
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="text-sm font-semibold tracking-wider uppercase py-2 text-emerald-500"
          >
            Contact / Hire Me
          </a>
        </div>
      )}
    </>
  );
}
