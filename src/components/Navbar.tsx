"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { flushSync } from "react-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { markComingFromWork } from "@/lib/introState";

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined" || typeof MutationObserver === "undefined") {
    return () => {};
  }
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === "class") {
        callback();
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  if (typeof document === "undefined") return true;
  return document.documentElement.classList.contains("dark");
}

function getThemeServerSnapshot() {
  return true;
}

export function Navbar() {
  const pathname = usePathname();
  const isWorkPage = pathname === "/work";

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light") {
        document.documentElement.classList.remove("dark");
      } else if (saved === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const nextDark = !isDark;

    const applyTheme = () => {
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

      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { finished: Promise<void> };
      };

      if (doc.startViewTransition) {
        const transition = doc.startViewTransition(() => {
          flushSync(() => {
            applyTheme();
          });
        });

        transition.finished.finally(() => {
          document.documentElement.classList.remove("vt-disable-anim", "vt-wipe-active");
        });
      } else {
        applyTheme();
      }
    } else {
      applyTheme();
    }
  };

  const navItems = isWorkPage
    ? [
        { name: "Home", href: "/" },
        { name: "Technical", href: "#technical" },
        { name: "Digital", href: "#digital" },
        { name: "Contact", href: "/#contact" },
      ]
    : [
        { name: "Work", href: "/#work" },
        { name: "Skills", href: "/#skills" },
        { name: "About", href: "/#about" },
        { name: "Awards", href: "/#awards" },
        { name: "Journey", href: "/#trainings" },
        { name: "Contact", href: "/#contact" },
      ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isWorkPage) {
      markComingFromWork();
    }
    if (href.startsWith("/#") || href.startsWith("#")) {
      const targetId = href.replace("/#", "").replace("#", "");
      let el = document.getElementById(targetId);
      if (!el && targetId === "skills") {
        el = document.getElementById("what-i-can-do");
      }
      if (el) {
        e.preventDefault();
        const targetTop = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.round(targetTop),
          behavior: "smooth",
        });
        window.history.pushState(null, "", href);
      }
    }
    setMobileMenuOpen(false);
  };

  const transitionEase = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

  // Explicit color classes to guarantee perfect contrast in both light & dark mode
  const textMuted = scrolled
    ? "text-neutral-400"
    : isDark
    ? "text-white/60"
    : "text-neutral-800";

  const textActive = scrolled
    ? "text-white"
    : isDark
    ? "text-white"
    : "text-black";

  return (
    <>
      {/* Top Scroll Indicator Line matching Surya */}
      <motion.div
        style={{ scaleX }}
        className={`fixed top-0 left-0 right-0 h-[2.5px] origin-left z-[1000] pointer-events-none transition-colors duration-300 ${
          isDark ? "bg-white" : "bg-[#141414]"
        }`}
      />

      {/* Floating Sticky Navigation Container */}
      <motion.div
        className="fixed top-0 left-0 w-full z-[100] flex flex-col items-center pointer-events-none font-sans"
        animate={{ paddingTop: scrolled ? "1.25rem" : "0rem" }}
        transition={transitionEase}
      >
        <motion.nav
          layout
          transition={{
            layout: transitionEase,
            y: transitionEase,
            opacity: transitionEase,
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`pointer-events-auto flex items-center justify-between origin-top transition-[background-color,border-radius,padding,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative ${
            scrolled
              ? "w-auto bg-[#141414]/90 dark:bg-[#161616]/95 backdrop-blur-xl rounded-full px-7 md:px-9 py-3 md:py-3.5 shadow-2xl border border-white/10 dark:border-white/20 dark:shadow-[0_16px_40px_rgba(0,0,0,0.8)]"
              : `w-full bg-transparent px-6 md:px-16 py-5 md:py-8 rounded-none border-b shadow-none ${
                  isDark ? "border-white/[0.08]" : "border-black/[0.08]"
                }`
          }`}
        >
          {/* Nav Links Desktop with Rolling Text Animation */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item, idx) => (
              <li key={idx} className="relative group">
                {item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (isWorkPage) markComingFromWork();
                    }}
                    className="relative block overflow-hidden h-[18px]"
                  >
                    <div className="flex flex-col transition-transform duration-[0.5s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
                      <span
                        className={`text-[12px] lg:text-[13px] tracking-wide font-medium block h-[18px] leading-[18px] transition-colors ${textMuted}`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`text-[12px] lg:text-[13px] tracking-wide font-medium block h-[18px] leading-[18px] transition-colors ${textActive}`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="relative block overflow-hidden h-[18px]"
                  >
                    <div className="flex flex-col transition-transform duration-[0.5s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
                      <span
                        className={`text-[12px] lg:text-[13px] tracking-wide font-medium block h-[18px] leading-[18px] transition-colors ${textMuted}`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`text-[12px] lg:text-[13px] tracking-wide font-medium block h-[18px] leading-[18px] transition-colors ${textActive}`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger Button */}
          <div
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden cursor-pointer flex justify-end items-center transition-colors duration-700 ${
              scrolled ? "text-white" : isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            <div
              className={`flex items-center justify-center transition-all duration-700 ${
                scrolled
                  ? "w-10 h-10 bg-[#141414] dark:bg-[#1a1a1a] rounded-full shadow-xl border border-white/10 dark:border-white/20"
                  : ""
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Right Section: Divider + Theme Toggle */}
          <div
            className={`flex items-center gap-4 ml-6 md:ml-8 pl-5 md:pl-6 border-l transition-colors duration-700 ${
              scrolled
                ? "border-white/15 dark:border-white/20"
                : isDark
                ? "border-white/15"
                : "border-black/15"
            }`}
          >
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="transition-colors duration-500 cursor-pointer flex items-center justify-center"
            >
              {isDark ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white hover:text-neutral-300 transition-colors"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-colors ${
                    scrolled
                      ? "text-white hover:text-neutral-300"
                      : "text-neutral-900 hover:text-black"
                  }`}
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Dropdown Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`absolute top-[100%] left-4 right-4 mt-3 rounded-2xl p-5 shadow-2xl overflow-hidden flex flex-col gap-3 md:hidden backdrop-blur-2xl ${
                  scrolled
                    ? "bg-[#141414]/95 dark:bg-[#181818]/98 border border-white/10 dark:border-white/20"
                    : isDark
                    ? "bg-[#161616]/98 border border-white/15"
                    : "bg-white/95 border border-black/10 shadow-lg"
                }`}
              >
                {navItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-[13px] tracking-wide font-medium w-full border-b pb-2.5 transition-colors ${
                      scrolled
                        ? "text-neutral-300 hover:text-white border-white/10"
                        : isDark
                        ? "text-neutral-300 hover:text-white border-white/10"
                        : "text-neutral-900 hover:text-black border-black/10"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </motion.div>
    </>
  );
}
