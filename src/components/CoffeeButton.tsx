"use client";

import React, { useState, useEffect } from "react";
import { Coffee } from "lucide-react";
import { useCoffeeCount } from "@/lib/useCoffeeCount";

interface CoffeeButtonProps {
  alwaysVisible?: boolean;
}

export function CoffeeButton({ alwaysVisible = false }: CoffeeButtonProps) {
  const { count, increment } = useCoffeeCount();
  const [popped, setPopped] = useState(false);
  const [visible, setVisible] = useState(alwaysVisible);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (alwaysVisible) return;

    const handleScroll = () => {
      // Hide during initial hero screen, appear when scrolling towards #work and beyond
      const isScrolledPastHero = window.scrollY > window.innerHeight * 0.35;
      setVisible(isScrolledPastHero);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysVisible]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPopped(true);
    setTimeout(() => setPopped(false), 450);
    increment();
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
      <span className="coffee-count" suppressHydrationWarning>
        {count}
      </span>
    </button>
  );
}
