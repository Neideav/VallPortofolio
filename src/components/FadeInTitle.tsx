"use client";

import React, { useState, useEffect, useRef } from "react";

interface FadeInTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string;
  className?: string;
}

export function FadeInTitle({
  text,
  className = "",
  ...props
}: FadeInTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h2
      ref={ref}
      className={`section-title fade-in-title ${isVisible ? "is-visible" : ""} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      {...props}
    >
      <span style={{ whiteSpace: "pre-line" }}>{text}</span>
    </h2>
  );
}
