"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";

interface WorkProject {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

const workProjects: WorkProject[] = [
  {
    id: "fintrack-pro",
    title: "FinTrack Pro - Aplikasi Manajemen Keuangan Terpadu & Multi-User",
    description:
      "Aplikasi web manajemen keuangan pribadi & grup yang dilengkapi analisis arus kas, budgeting bulanan, target tabungan, otomatisasi transaksi berulang, serta audit trail keamanan finansial.",
    image: "/images/projects/fintrack-pro.png",
    link: "https://github.com/Neideav/fintrack-pro",
    tags: ["React.js", "Express.js", "Tailwind CSS", "MySQL", "JWT Auth", "Recharts"],
  },
  {
    id: "shopcart",
    title: "Shopcart - Modern E-Commerce Platform & Audio Electronics Storefront",
    description:
      "Modern e-commerce storefront styled with clean aesthetics (warm ivory, dark forest emerald, spacious typography) featuring dynamic product discovery, search filtering, and responsive shopping cart.",
    image: "/images/projects/shopcart.png",
    link: "https://github.com/Neideav/shopcart",
    tags: ["Laravel", "Blade", "Tailwind CSS", "SQLite", "E-Commerce", "UI/UX"],
  },
  {
    id: "kumo-ai",
    title: "Kumo AI — Next-Generation Intelligent Workspace & AI Assistant",
    description:
      "Ruang kerja AI generasi baru dengan streaming Server-Sent Events (SSE) berkecepatan tinggi, antarmuka minimalis modern, eksplorasi ide kreatif, analisis konsep, dan debugging kode multi-model.",
    image: "/images/projects/kumo-ai.png",
    link: "https://github.com/Neideav/KumoAI",
    tags: ["React 18", "Vite", "Tailwind CSS", "SSE Streaming", "AI Intelligence", "FastAPI"],
  },
];

export function Work() {
  const [activeIndex, setActiveIndex] = useState(1);

  const getPositionStyle = (index: number) => {
    const total = workProjects.length;
    const diff = (index - activeIndex + total) % total;

    // Center
    if (diff === 0) {
      return {
        transform: "translate(-50%, -50%) scale(1)",
        zIndex: 5,
        opacity: 1,
        pointerEvents: "auto" as const,
      };
    }
    // Near Right
    if (diff === 1) {
      return {
        transform: "translate(calc(-50% + 220px), -50%) scale(0.74)",
        zIndex: 4,
        opacity: 0.85,
        pointerEvents: "auto" as const,
      };
    }
    // Near Left
    if (diff === 2) {
      return {
        transform: "translate(calc(-50% - 220px), -50%) scale(0.74)",
        zIndex: 4,
        opacity: 0.85,
        pointerEvents: "auto" as const,
      };
    }

    return {
      transform: "translate(-50%, -50%) scale(0.4)",
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none" as const,
    };
  };

  const getMobileStackStyle = (index: number) => {
    const total = workProjects.length;
    const diff = (index - activeIndex + total) % total;

    switch (diff) {
      case 0:
        return {
          transform: "translate(0px, 0px) rotate(0deg) scale(1)",
          opacity: 1,
          zIndex: 30,
        };
      case 1:
        return {
          transform: "translate(12px, -7.6px) rotate(-2.7deg) scale(0.94)",
          opacity: 0.8,
          zIndex: 20,
        };
      case 2:
        return {
          transform: "translate(14px, 17.6px) rotate(6.6deg) scale(0.88)",
          opacity: 0.6,
          zIndex: 10,
        };
      default:
        return {
          transform: "translate(106px, -44px) rotate(18deg) scale(0.88)",
          opacity: 0,
          zIndex: 5,
        };
    }
  };

  const activeProject = workProjects[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % workProjects.length);
  };

  return (
    <section id="work" className="section">
      {/* Header */}
      <div className="work-header">
        <div>
          <div className="section-label">Selected Work</div>
          <h2 className="section-title">Work Gallery</h2>
          <p className="section-desc">
            A collection of cloud systems, digital projects, and technical work I&apos;ve built.
          </p>
        </div>
        <a
          href="https://github.com/Neideav"
          target="_blank"
          rel="noopener noreferrer"
          className="work-album-btn-top"
        >
          <span>View More Projects</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Desktop 3D Album Coverflow */}
      <div className="work-album hidden md:flex">
        <div className="work-album-inner">
          {workProjects.map((project, index) => {
            const isCenter = index === activeIndex;
            return (
              <div
                key={project.id}
                onClick={() => setActiveIndex(index)}
                className={`work-album-item ${isCenter ? "work-album-item-center" : ""}`}
                style={getPositionStyle(index)}
              >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority={isCenter}
                    className="work-album-img"
                    sizes="400px"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Stacked Interactive View */}
      <div className="md:hidden my-8 px-4">
        <div
          onClick={handleNext}
          className="relative w-full aspect-[16/10] max-w-[320px] mx-auto cursor-pointer select-none"
          title="Tap to view next project"
        >
          {workProjects.map((project, index) => {
            const style = getMobileStackStyle(index);
            return (
              <div
                key={project.id}
                className="stacked-image"
                style={style}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover rounded-xl"
                  sizes="320px"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Work Info */}
      <div className="work-info">
        <h3 className="work-info-title">{activeProject.title}</h3>
        <p className="work-info-desc">{activeProject.description}</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {activeProject.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={activeProject.link}
          target="_blank"
          rel="noopener noreferrer"
          className="work-info-link"
        >
          <span>View Project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
