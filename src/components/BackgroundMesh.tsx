"use client";

import React from "react";

export function BackgroundMesh() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Subtle fine grid overlay */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 mask-radial" />

      {/* Faint ambient light glow at the hero area */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-emerald-950/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Subtle architectural wave lines inspired by technical topographic drawings */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.14] stroke-white/[0.12] dark:stroke-slate-400/[0.12]"
        viewBox="0 0 1440 3200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <g strokeWidth="1">
          {/* Hero waves */}
          <path d="M-100 240 C 220 140, 520 340, 840 240 C 1140 140, 1340 320, 1560 220" />
          <path d="M0 420 C 320 300, 620 480, 940 380 C 1240 280, 1420 440, 1480 340" />
          <path d="M-60 620 C 260 520, 560 700, 880 600 C 1180 500, 1380 660, 1520 560" />

          {/* About & Capabilities waves */}
          <path d="M0 920 C 340 800, 640 980, 960 880 C 1260 780, 1440 940, 1480 840" />
          <path d="M-80 1200 C 240 1100, 540 1280, 860 1180 C 1160 1080, 1360 1240, 1540 1140" />
          <path d="M0 1480 C 320 1380, 620 1560, 920 1460 C 1220 1360, 1400 1520, 1460 1420" />

          {/* Projects & Journey waves */}
          <path d="M-120 1820 C 220 1720, 520 1900, 840 1800 C 1160 1700, 1380 1880, 1560 1780" />
          <path d="M0 2160 C 300 2060, 600 2240, 920 2140 C 1220 2040, 1420 2220, 1460 2120" />
          <path d="M-80 2520 C 240 2420, 560 2600, 880 2500 C 1180 2400, 1380 2580, 1520 2480" />

          {/* Contact waves */}
          <path d="M0 2900 C 340 2780, 660 2980, 980 2860 C 1260 2760, 1420 2920, 1460 2820" />
        </g>
      </svg>

      {/* Corner crosshairs for technical drafting feel */}
      <div className="absolute top-24 left-6 font-mono text-[9px] text-slate-700/60 tracking-wider">
        + SYS_COORD: 0x7F001
      </div>
      <div className="absolute top-24 right-6 font-mono text-[9px] text-slate-700/60 tracking-wider">
        REGION: AP-SOUTHEAST-1 +
      </div>
    </div>
  );
}
