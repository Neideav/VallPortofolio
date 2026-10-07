"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { personalInfo as defaultPersonal } from "@/data/personal";
import { fetchPersonalInfo } from "@/lib/personal";

export function Hero() {
  const [info, setInfo] = useState(defaultPersonal);

  useEffect(() => {
    fetchPersonalInfo().then((data) => {
      if (data) setInfo(data);
    });
  }, []);

  const marqueeName = (info.name || "NAUVALDY MAULANA").toUpperCase();

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
            src={info.avatarUrl || "/images/nauval-portrait.png"}
            alt={info.name}
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
          {info.name}
        </h1>
        <div className="hero-subtitle">
          {info.title}
        </div>
        <p className="hero-statement">
          {info.shortBio || defaultPersonal.shortBio}
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
