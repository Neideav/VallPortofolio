"use client";

import React, { useState, useEffect } from "react";
import { Coffee } from "lucide-react";

export function CoffeeButton() {
  const [count, setCount] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("nauval_coffee_count");
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return 24;
  });

  const [popped, setPopped] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hide during initial hero screen, appear when scrolling towards #work and beyond
      const isScrolledPastHero = window.scrollY > window.innerHeight * 0.35;
      setVisible(isScrolledPastHero);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("nauval_coffee_count", next.toString());
      } catch {
        // ignore
      }
      return next;
    });
    setPopped(true);
    setTimeout(() => setPopped(false), 450);
  };

  return (
    <button
      onClick={handleClick}
      className={`coffee-btn ${visible ? "coffee-btn--visible" : ""}`}
      aria-label="Get me a coffee"
      title="Buy me a coffee"
    >
      <span className="coffee-text">Get me a coffee</span>
      {!imgError ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/images/gif/coffee.gif"
          alt="Coffee"
          className={`coffee-gif ${popped ? "coffee-gif--pop" : ""}`}
          onError={() => setImgError(true)}
          draggable={false}
        />
      ) : (
        <div className={`p-0.5 text-amber-500 transition-transform ${popped ? "scale-125" : ""}`}>
          <Coffee className="w-5 h-5 text-amber-500" />
        </div>
      )}
      <span className="coffee-count">{count}</span>
    </button>
  );
}
