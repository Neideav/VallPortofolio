"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // In milliseconds for backward compatibility
  className?: string;
  style?: React.CSSProperties;
  yOffset?: number;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  style = {},
  yOffset = 20,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  // Convert milliseconds from legacy API to seconds for Framer Motion
  const delaySec = Math.max(0, delay / 1000);

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.65,
        delay: delaySec,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
