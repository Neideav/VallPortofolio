"use client";

import React, { useState, useEffect, useRef } from "react";

interface FadeInTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  speed?: number;
  delay?: number;
}

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export function FadeInTitle({
  text,
  className = "",
  as: Component = "h2",
  speed = 45,
  delay = 140,
  ...props
}: FadeInTitleProps) {
  const cleanText = decodeEntities(text);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorFading, setCursorFading] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setHasStarted(true);
      setDisplayedCount(cleanText.length);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          setCursorVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [cleanText.length]);

  useEffect(() => {
    if (!hasStarted) return;
    if (displayedCount >= cleanText.length) return;

    let charIndex = 0;
    let timer: NodeJS.Timeout | null = null;
    let fadeTimer: NodeJS.Timeout | null = null;
    let removeTimer: NodeJS.Timeout | null = null;

    const startTimer = setTimeout(() => {
      timer = setInterval(() => {
        charIndex += 1;
        setDisplayedCount(charIndex);

        if (charIndex >= cleanText.length) {
          if (timer) clearInterval(timer);
          // Keep cursor blinking for 1.4s after typing finishes, then fade out
          fadeTimer = setTimeout(() => {
            setCursorFading(true);
            removeTimer = setTimeout(() => {
              setCursorVisible(false);
            }, 500);
          }, 1400);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (timer) clearInterval(timer);
      if (fadeTimer) clearTimeout(fadeTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, [hasStarted, cleanText, speed, delay, displayedCount]);

  const displayedText = cleanText.slice(0, displayedCount);

  return (
    <Component
      ref={ref}
      aria-label={cleanText}
      className={`section-title relative inline-block min-h-[1.15em] ${className}`}
      {...props}
    >
      <span className="inline-block whitespace-pre-line">
        {hasStarted ? displayedText : "\u00A0"}
      </span>
      {cursorVisible && (
        <span
          className={`typewriter-cursor transition-opacity duration-500 ${
            cursorFading ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden="true"
        />
      )}
    </Component>
  );
}
