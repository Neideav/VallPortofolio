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
  delay = 100,
  ...props
}: FadeInTitleProps) {
  const cleanText = decodeEntities(text);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
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
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [cleanText.length]);

  useEffect(() => {
    if (!hasStarted) return;

    let currentIndex = 0;
    let intervalId: NodeJS.Timeout | null = null;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        currentIndex += 1;
        setDisplayedCount(currentIndex);

        if (currentIndex >= cleanText.length) {
          if (intervalId) clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [hasStarted, cleanText, speed, delay]);

  const displayedText = cleanText.slice(0, displayedCount);

  return (
    <Component
      ref={ref}
      aria-label={cleanText}
      className={`section-title relative inline-flex items-center flex-wrap ${className}`}
      {...props}
    >
      <span className="whitespace-pre-line">
        {hasStarted ? displayedText : "\u00A0"}
      </span>
      {/* Blinking typewriter caret matching screenshot */}
      {hasStarted && (
        <span
          className="typewriter-cursor"
          aria-hidden="true"
        />
      )}
    </Component>
  );
}
