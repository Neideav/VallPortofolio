"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";

const words = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Hola",
  "Guten Tag",
  "Konnichiwa",
  "Namaste",
  "Halo",
];

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Last word ("Halo"): pause for 600ms before exit animation
    if (index === words.length - 1) {
      const timer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }

    // First word stays 1000ms, subsequent words cycle rapidly every 180ms
    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, index === 0 ? 1000 : 180);

    return () => clearTimeout(timer);
  }, [index, onComplete]);

  // Curtain columns slide up sequentially with staggered delay
  const slideUp: Variants = {
    initial: { top: 0 },
    exit: (i: number) => ({
      top: "-100vh",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as const,
        delay: 0.08 * i,
      },
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      {/* 5 Shutter Columns sliding up from left to right */}
      <div className="absolute inset-0 flex w-full h-full">
        {[0, 1, 2, 3, 4].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={slideUp}
            initial="initial"
            exit="exit"
            className="relative w-1/5 h-full bg-[#050505]"
          />
        ))}
      </div>

      {/* Greeting text in center */}
      <motion.div
        variants={{
          initial: { opacity: 1 },
          exit: {
            opacity: 0,
            y: -50,
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const },
          },
        }}
        initial="initial"
        exit="exit"
        className="relative z-10 flex items-center text-white text-[38px] sm:text-[48px] md:text-[56px] font-medium tracking-tight select-none"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-3.5 h-3.5 md:w-4 md:h-4 bg-emerald-400 rounded-full mr-4 md:mr-6 shadow-[0_0_14px_rgba(52,211,153,0.9)]"
        />
        <p className="font-sans font-medium">{words[index]}</p>
      </motion.div>
    </motion.div>
  );
}
