"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
      <motion.div
        className="bg-name-marquee"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
      >
        <div className="bg-name-track">
          <span className="bg-name-text">{marqueeName}</span>
          <span className="bg-name-text">{marqueeName}</span>
          <span className="bg-name-text">{marqueeName}</span>
          <span className="bg-name-text">{marqueeName}</span>
        </div>
      </motion.div>

      {/* Concentric Circles in Center */}
      <motion.div
        className="concentric-circles"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
      </motion.div>

      {/* Profile Image Wrapper */}
      <div className="profile-wrap">
        <motion.div
          className="profile-image-container"
          initial={{ opacity: 0, y: 70, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 1.3,
            delay: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Image
            src={info.avatarUrl || "/images/nauval-portrait.png"}
            alt={info.name}
            fill
            priority
            unoptimized
            className="profile-image"
            sizes="(max-width: 768px) 95vw, 620px"
          />
        </motion.div>
      </div>

      {/* Bottom Left Hero Text */}
      <motion.div
        className="hero-text"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="hero-name">
          {info.name}
        </h1>
        <div className="hero-subtitle">
          {info.title}
        </div>
        <p className="hero-statement">
          {info.shortBio || defaultPersonal.shortBio}
        </p>
      </motion.div>

      {/* Bottom Right Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
      >
        <div className="scroll-line" />
        <span className="scroll-text">Scroll Down</span>
      </motion.div>
    </section>
  );
}
