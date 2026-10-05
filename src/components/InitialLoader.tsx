"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InitialLoader({ onComplete }: { onComplete?: () => void }) {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShow(false);
            if (onComplete) onComplete();
          }, 250);
          return 100;
        }
        return prev + 25;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080c] select-none"
        >
          {/* Subtle background glow */}
          <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Minimal Logo / Monogram */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5"
            >
              <span className="font-mono text-emerald-400 font-bold text-lg tracking-wider">
                N
              </span>
            </motion.div>

            {/* Developer Name */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-base font-semibold tracking-wide text-white mb-1"
            >
              Muhammad Bahruddin Nauvaldy Maulana
            </motion.div>

            {/* Monospace Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="font-mono text-xs text-emerald-400/90 tracking-widest uppercase mb-6"
            >
              Cloud · Backend · DevOps
            </motion.div>

            {/* Clean Progress Line */}
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
            </div>

            <div className="font-mono text-[10px] text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM BOOT // {progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
