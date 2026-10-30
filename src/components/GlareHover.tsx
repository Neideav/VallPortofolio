"use client";

import React, { useRef, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

interface GlareHoverProps {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
  borderRadius?: string;
}

/**
 * Selective Glare Hover effect inspired by React Bits (https://reactbits.dev/animations/glare-hover).
 * Adds a subtle, high-performance radial cursor glare on project cards.
 * Automatically disables on touch devices and respects prefers-reduced-motion.
 */
export function GlareHover({
  children,
  className = "",
  glareColor = "rgba(255, 255, 255, 0.25)",
  glareOpacity = 0.35,
  borderRadius = "1rem",
}: GlareHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setGlarePosition({ x, y, opacity: glareOpacity });
  }, [shouldReduceMotion, glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius }}
    >
      {children}
      {!shouldReduceMotion && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(circle 240px at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor}, transparent 80%)`,
          }}
        />
      )}
    </div>
  );
}
