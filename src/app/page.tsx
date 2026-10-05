"use client";

import React from "react";
import { BackgroundLines } from "@/components/BackgroundLines";
import { Navbar } from "@/components/Navbar";
import { CoffeeButton } from "@/components/CoffeeButton";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { WhatICanDo } from "@/components/WhatICanDo";
import { About } from "@/components/About";
import { Awards } from "@/components/Awards";
import { Trainings } from "@/components/Trainings";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="portfolio-root relative min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-400">
      {/* Background SVG curved topographic lines spanning the entire page */}
      <BackgroundLines />

      {/* Floating Coffee button on the left edge */}
      <CoffeeButton />

      {/* Floating Sticky Navigation */}
      <Navbar />

      {/* Main Content Sections matching reference layout */}
      <main className="w-full relative z-10">
        <Hero />
        <Work />
        <WhatICanDo />
        <About />
        <Awards />
        <Trainings />
        <Contact />
      </main>

      {/* Footer & Back to Top */}
      <Footer />
    </div>
  );
}
