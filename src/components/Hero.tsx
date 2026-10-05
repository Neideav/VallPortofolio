"use client";

import React from "react";
import Image from "next/image";

export function Hero() {
  const marqueeName = "NAUVALDY MAULANA";

  return (
    <section id="hero" className="hero-root">
      {/* Background Main Scrolling Marquee */}
      <div className="bg-name-marquee">
        <div className="bg-name-track">
          <span className="bg-name-text">{marqueeName}</span>
          <span className="bg-name-text">{marqueeName}</span>
          <span className="bg-name-text">{marqueeName}</span>
          <span className="bg-name-text">{marqueeName}</span>
        </div>
      </div>

      {/* Concentric Circles in Center */}
      <div className="concentric-circles" aria-hidden="true">
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
      </div>

      {/* Profile Image Wrapper */}
      <div className="profile-wrap">
        <div className="profile-image-container">
          <Image
            src="/images/nauval-portrait.png"
            alt="Muhammad Bahruddin Nauvaldy Maulana"
            fill
            priority
            unoptimized
            className="profile-image"
            sizes="(max-width: 768px) 95vw, 620px"
          />
        </div>
      </div>

      {/* Bottom Left Hero Text */}
      <div className="hero-text">
        <h1 className="hero-name">
          MUHAMMAD BAHRUDDIN NAUVALDY MAULANA
        </h1>
        <div className="hero-subtitle">
          Cloud Engineer · Backend Developer · DevOps Engineer
        </div>
        <p className="hero-statement">
          I build reliable backend systems, cloud infrastructure, and automated delivery
          pipelines with a security-first mindset.
        </p>
      </div>

      {/* Bottom Right Scroll Indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll Down</span>
      </div>
    </section>
  );
}
