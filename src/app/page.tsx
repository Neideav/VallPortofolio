"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/Preloader";
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
import { checkHasSeenIntro, markIntroAsSeen } from "@/lib/introState";

export default function Home() {
  const [transitionOnly, setTransitionOnly] = useState(() => checkHasSeenIntro());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!transitionOnly && checkHasSeenIntro()) {
      setTransitionOnly(true);
    }
  }, [transitionOnly]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined" && !window.location.hash) {
        window.scrollTo(0, 0);
      }
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoading]);

  const handleComplete = () => {
    setIsLoading(false);
    markIntroAsSeen();
    if (typeof window !== "undefined" && window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 50);
    }
  };

  return (
    <>
      {/* Animated Greeting & Staggered Curtain Preloader */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader
            transitionOnly={transitionOnly}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>

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
    </>
  );
}
