"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { personalInfo } from "@/data/personal";

export function About() {
  return (
    <section
      id="about"
      className="w-full max-w-7xl mx-auto py-20 md:py-32 cursor-default overflow-hidden scroll-mt-24 border-t border-[var(--line)]"
    >
      {/* Section Header: Discover / About Me (Exact match to RyHar) */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 md:px-12 mb-14 md:mb-20 w-full text-left"
      >
        <h2 className="text-sm font-bold tracking-[0.2em] text-[var(--muted)] uppercase mb-3">
          Discover
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text)] tracking-tighter">
          About Me
        </h3>
      </motion.div>

      {/* Main Grid: 12 columns */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 px-6 md:px-12 items-center">
        {/* Left Column (lg:col-span-5): Image Card with DEV. Watermark */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col items-center justify-center relative"
        >
          <div className="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[440px] relative">
            {/* Card Frame */}
            <div className="relative z-10 p-2 bg-[var(--surface)] border border-[var(--line)] rounded-3xl shadow-2xl overflow-hidden aspect-[4/5] w-full group transition-all duration-500 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.25)] hover:-translate-y-1">
              <Image
                src="/images/nauval-portrait.png"
                alt={personalInfo.name}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-cover object-[48%_14%] transition-all duration-700 scale-100 group-hover:scale-105"
                priority
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/90 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl pointer-events-none" />
            </div>

            {/* DEV. Watermark behind image */}
            <div className="absolute -bottom-8 -left-8 text-8xl lg:text-9xl font-black text-[var(--muted)]/10 select-none pointer-events-none tracking-tighter mix-blend-multiply dark:mix-blend-screen z-0">
              DEV.
            </div>
          </div>
        </motion.div>

        {/* Right Column (lg:col-span-7): Structured Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          {/* Top 2-Column: Who Am I & My Approach */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {/* Column 1: Who Am I */}
            <div className="flex flex-col">
              <h4 className="text-lg md:text-xl font-bold text-[var(--text)] mb-4 flex items-center border-b border-[var(--line)] pb-4">
                Who Am I
              </h4>
              <p className="text-base text-[var(--muted)] leading-relaxed font-medium">
                Saya seorang Cloud Engineer &amp; Backend Developer yang berpengalaman dalam merancang dan mengembangkan arsitektur sistem menggunakan AWS, Docker, Kubernetes, Linux, Laravel, Node.js, dan MySQL. Saya terampil dalam membangun REST APIs, otomasi CI/CD pipelines, dan sistem infrastruktur server yang aman dan skalabel.
              </p>
            </div>

            {/* Column 2: My Approach */}
            <div className="flex flex-col">
              <h4 className="text-lg md:text-xl font-bold text-[var(--text)] mb-4 flex items-center border-b border-[var(--line)] pb-4">
                My Approach
              </h4>
              <p className="text-base text-[var(--muted)] leading-relaxed font-medium">
                Saya berkomitmen untuk memberikan solusi yang efisien, mudah dikelola, dan skalabel melalui praktik terbaik rekayasa perangkat lunak dan keandalan sistem cloud (best engineering practices &amp; high availability).
              </p>
            </div>
          </div>

          {/* Middle & Bottom: Personal Details Section */}
          <div className="mt-14 md:mt-18">
            <h4 className="text-lg md:text-xl font-bold text-[var(--text)] mb-8 border-b border-[var(--line)] pb-4 border-l-4 border-l-[var(--text)] dark:border-l-emerald-500 pl-4">
              Personal Details
            </h4>

            {/* 2-Column Key-Value Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
              {/* 1. Name */}
              <div className="flex flex-col p-2.5 -m-2.5 rounded-xl transition-colors duration-300 hover:bg-[var(--surface-2)]">
                <span className="text-xs uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
                  Name
                </span>
                <span className="text-base font-semibold text-[var(--text)]">
                  {personalInfo.name}
                </span>
              </div>

              {/* 2. Place of Birth */}
              <div className="flex flex-col p-2.5 -m-2.5 rounded-xl transition-colors duration-300 hover:bg-[var(--surface-2)]">
                <span className="text-xs uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
                  Place of Birth
                </span>
                <span className="text-base font-semibold text-[var(--text)]">
                  {personalInfo.placeOfBirth}
                </span>
              </div>

              {/* 3. Role */}
              <div className="flex flex-col p-2.5 -m-2.5 rounded-xl transition-colors duration-300 hover:bg-[var(--surface-2)]">
                <span className="text-xs uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
                  Role
                </span>
                <span className="text-base font-semibold text-[var(--text)]">
                  Cloud &amp; DevOps Engineer
                </span>
              </div>

              {/* 4. GPA */}
              <div className="flex flex-col p-2.5 -m-2.5 rounded-xl transition-colors duration-300 hover:bg-[var(--surface-2)]">
                <span className="text-xs uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
                  GPA
                </span>
                <span className="text-base font-semibold text-[var(--text)]">
                  {personalInfo.gpa}
                </span>
              </div>

              {/* 5. Email */}
              <div className="flex flex-col p-2.5 -m-2.5 rounded-xl transition-colors duration-300 hover:bg-[var(--surface-2)]">
                <span className="text-xs uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
                  Email
                </span>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-base font-semibold text-[var(--text)] hover:text-emerald-500 transition-colors underline decoration-[var(--muted)]/30 underline-offset-4"
                >
                  {personalInfo.email}
                </a>
              </div>

              {/* 6. Education */}
              <div className="flex flex-col p-2.5 -m-2.5 rounded-xl transition-colors duration-300 hover:bg-[var(--surface-2)]">
                <span className="text-xs uppercase tracking-widest font-bold text-[var(--muted)] mb-1">
                  Education
                </span>
                <span className="text-base font-semibold text-[var(--text)]">
                  {personalInfo.education}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee Strip below About Section (Exact match to RyHar) */}
      <div className="mt-20 md:mt-28 pb-4 border-t border-[var(--line)] pt-12 overflow-hidden select-none">
        {/* Track 1: Hello I'm Nauval */}
        <div className="relative overflow-hidden w-full whitespace-nowrap mb-3">
          <div className="flex w-max animate-[marquee_25s_linear_infinite]">
            <span className="shrink font-black tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--text)] opacity-10 uppercase pr-8">
              Hello I&apos;m Nauval&nbsp;&nbsp;•&nbsp;&nbsp;Hello I&apos;m Nauval&nbsp;&nbsp;•&nbsp;&nbsp;Hello I&apos;m Nauval&nbsp;&nbsp;•&nbsp;&nbsp;Hello I&apos;m Nauval&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
            <span className="shrink font-black tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--text)] opacity-10 uppercase pr-8">
              Hello I&apos;m Nauval&nbsp;&nbsp;•&nbsp;&nbsp;Hello I&apos;m Nauval&nbsp;&nbsp;•&nbsp;&nbsp;Hello I&apos;m Nauval&nbsp;&nbsp;•&nbsp;&nbsp;Hello I&apos;m Nauval&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
          </div>
        </div>

        {/* Track 2: Cloud & DevOps Engineer */}
        <div className="relative overflow-hidden w-full whitespace-nowrap">
          <div className="flex w-max animate-[marquee_30s_linear_infinite_reverse]">
            <span className="shrink font-black tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--text)] opacity-10 uppercase pr-8">
              Cloud &amp; DevOps Engineer&nbsp;&nbsp;•&nbsp;&nbsp;Cloud &amp; DevOps Engineer&nbsp;&nbsp;•&nbsp;&nbsp;Cloud &amp; DevOps Engineer&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
            <span className="shrink font-black tracking-tighter text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--text)] opacity-10 uppercase pr-8">
              Cloud &amp; DevOps Engineer&nbsp;&nbsp;•&nbsp;&nbsp;Cloud &amp; DevOps Engineer&nbsp;&nbsp;•&nbsp;&nbsp;Cloud &amp; DevOps Engineer&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
