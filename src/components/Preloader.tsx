"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";

interface GreetingItem {
  text: string;
  lang: string;
}

const greetings: GreetingItem[] = [
  { text: "Hello", lang: "English" },
  { text: "こんにちは", lang: "Japanese" },
  { text: "Bonjour", lang: "French" },
  { text: "Hola", lang: "Spanish" },
  { text: "Hallo", lang: "German" },
  { text: "你好", lang: "Chinese" },
  { text: "مرحباً", lang: "Arabic" },
  { text: "안녕하세요", lang: "Korean" },
  { text: "Привет", lang: "Russian" },
  { text: "Halo", lang: "Indonesian" },
];

interface PreloaderProps {
  onComplete: () => void;
  transitionOnly?: boolean;
}

export function Preloader({ onComplete, transitionOnly = false }: PreloaderProps) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (transitionOnly) {
      // For page transition, skip words completely and trigger slide-up exit after brief pause
      const timer = setTimeout(() => {
        onComplete();
      }, 60);
      return () => clearTimeout(timer);
    }

    let startTime: number | null = null;
    let animationFrameId: number;
    let completeTimeout: NodeJS.Timeout | null = null;
    const TOTAL_DURATION = 2200; // 2.2 seconds smooth progression

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const currentProgress = Math.min(
        100,
        Math.max(1, Math.floor((elapsed / TOTAL_DURATION) * 100))
      );

      setProgress(currentProgress);

      // Map progress (1-100) across the 10 greetings
      const currentIdx = Math.min(
        greetings.length - 1,
        Math.floor((currentProgress / 100) * greetings.length)
      );
      setIndex(currentIdx);

      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        // Hold on 100% and "Halo" for 420ms before triggering curtain exit
        completeTimeout = setTimeout(() => {
          onComplete();
        }, 420);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (completeTimeout) clearTimeout(completeTimeout);
    };
  }, [onComplete, transitionOnly]);

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

      {/* Greeting text, Loading Line & 1-100 Counter in center */}
      {!transitionOnly && (
        <motion.div
          variants={{
            initial: { opacity: 1, y: 0 },
            exit: {
              opacity: 0,
              y: -40,
              transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as const },
            },
          }}
          initial="initial"
          exit="exit"
          className="relative z-10 flex flex-col items-center justify-center text-white select-none px-6"
        >
          {/* Greeting Word with indicator dot */}
          <div className="flex items-center text-[38px] sm:text-[48px] md:text-[58px] font-medium tracking-tight min-h-[70px] sm:min-h-[80px]">
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 bg-white rounded-full mr-4 sm:mr-5 shrink-0"
            />
            <p className="tabular-nums transition-all duration-150">
              {greetings[index].text}
            </p>
          </div>

          {/* Progress Bar & Counter Container */}
          <div className="w-56 sm:w-72 md:w-80 mt-4 sm:mt-6 space-y-2.5">
            {/* Line Loading (fills from left to right) */}
            <div className="w-full h-[2px] sm:h-[3px] bg-white/15 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-white rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom info: Language name & Percentage (1-100) */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono tracking-wider text-white/50">
              <span className="uppercase tracking-[0.2em]">
                {greetings[index].lang}
              </span>
              <span className="tabular-nums font-semibold text-white/90">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
