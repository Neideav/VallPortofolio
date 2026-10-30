"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  ExternalLink 
} from "lucide-react";
import { Reveal } from "./Reveal";
import { FadeInTitle } from "./FadeInTitle";
import { GlareHover } from "./GlareHover";
import { getProjects } from "@/lib/projects";

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
  {
    id: "project-shyeund",
    title: "ProjectShyeunD — Native Android Mobile Application",
    description:
      "Aplikasi mobile Android native yang dikembangkan menggunakan bahasa Kotlin dengan modern lifecycle components dan arsitektur modular terstruktur.",
    image: "/images/projects/cloudops.png",
    link: "https://github.com/Neideav/ProjectShyeunD",
    tags: ["Kotlin", "Android", "Mobile", "Gradle", "Clean Architecture"],
  },
  {
    id: "vallonation",
    title: "vallonation — Reactive Web Application & Creative Platform",
    description:
      "Platform web modern yang dibangun dengan ekosistem TypeScript untuk menghadirkan antarmuka dinamis dan performa rendering tinggi.",
    image: "/images/projects/ctf.png",
    link: "https://github.com/Neideav/vallonation",
    tags: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Web App"],
  },
];

export function Work() {
  const [projectsList, setProjectsList] = useState<WorkProject[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("porto_projects_v1");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((p: Record<string, unknown>) => {
              const defaultMatch = workProjects.find((wp) => wp.id === p.id);
              const chosenImage =
                (typeof p.imageUrl === "string" && p.imageUrl) ||
                (typeof p.image === "string" && p.image) ||
                defaultMatch?.image ||
                "/images/projects/fintrack-pro.png";

              return {
                id: String(p.id || ""),
                title: String(p.title || ""),
                description: String(p.description || ""),
                image: chosenImage,
                link: String(p.githubUrl || p.github_url || defaultMatch?.link || "#"),
                tags: Array.isArray(p.technologies) ? (p.technologies as string[]) : defaultMatch?.tags || [],
              };
            });
          }
        }
      } catch {}
    }
    return workProjects;
  });
  const [activeIndex, setActiveIndex] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    getProjects().then((items) => {
      if (items && items.length > 0) {
        setProjectsList(
          items.map((p) => {
            const defaultMatch = workProjects.find((wp) => wp.id === p.id);
            const raw = p as unknown as Record<string, unknown>;
            const chosenImage =
              (typeof raw.imageUrl === "string" && raw.imageUrl) ||
              (typeof raw.image === "string" && raw.image) ||
              defaultMatch?.image ||
              "/images/projects/fintrack-pro.png";

            return {
              id: p.id,
              title: p.title,
              description: p.description,
              image: chosenImage,
              link: p.githubUrl,
              tags: p.technologies || [],
            };
          })
        );
      }
    });
  }, []);

  const total = projectsList.length || 1;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 40) {
      // Swiped left -> next
      handleNext();
    } else if (diff < -40) {
      // Swiped right -> prev
      handlePrev();
    }
    setTouchStartX(null);
  };

  // 5-Card Coverflow Algorithm matching Richard Miculob's reference
  const getPositionStyle = (index: number) => {
    let diff = (index - activeIndex + total) % total;
    if (diff > total / 2) {
      diff -= total;
    }

    const isCenter = diff === 0;
    const absDiff = Math.abs(diff);
    const direction = isCenter ? 0 : diff / absDiff;

    if (isCenter) {
      return {
        transform: "translate(-50%, -50%) scale(1)",
        zIndex: 5,
        opacity: 1,
        pointerEvents: "auto" as const,
      };
    }

    // Near cards (offset 200px), Far cards (offset 330px)
    const translateX = direction * (200 + (absDiff - 1) * 130);
    const scale = Math.max(0.55, 1 - 0.28 * absDiff);
    const opacity = absDiff <= 2 ? Math.max(0, 0.85 - (absDiff - 1) * 0.55) : 0;
    const zIndex = 5 - absDiff;

    return {
      transform: `translate(calc(-50% + ${translateX}px), -50%) scale(${scale})`,
      zIndex,
      opacity,
      pointerEvents: absDiff <= 2 ? ("auto" as const) : ("none" as const),
    };
  };

  const activeProject = projectsList[activeIndex] || projectsList[0];

  return (
    <section id="work" className="section border-t border-[var(--line)]">
      {/* Header */}
      <Reveal delay={0}>
        <div className="work-header">
          <div>
            <div className="section-label">Selected Work</div>
            <FadeInTitle text="Work Gallery" />
            <p className="section-desc">
              A collection of cloud systems, digital projects, and technical work I&apos;ve built.
            </p>
          </div>
          <Link
            href="/work"
            className="work-album-btn-top group"
            aria-label="View More Projects"
          >
            <span>View More Projects</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </Reveal>

      {/* Desktop 3D Album Coverflow */}
      <Reveal delay={100}>
        <div className="work-album hidden md:flex">
          <div className="work-album-inner">
            {projectsList.map((project, index) => {
              const isCenter = index === activeIndex;
              return (
                <div
                  key={project.id}
                  onClick={() => setActiveIndex(index)}
                  className={`work-album-item ${isCenter ? "work-album-item-center" : ""}`}
                  style={getPositionStyle(index)}
                >
                  <GlareHover borderRadius="0.75rem" className="w-full aspect-video shadow-2xl">
                    <div className="relative w-full h-full aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        priority={isCenter}
                        unoptimized
                        className="work-album-img"
                        sizes="400px"
                      />
                    </div>
                  </GlareHover>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Mobile Polished Carousel View */}
      <Reveal delay={150}>
        <div
          className="md:hidden my-6 px-1"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full max-w-[360px] mx-auto">
            {/* Main Card Image with smooth transition */}
            <div
              onClick={handleNext}
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--surface-2)] shadow-xl cursor-pointer select-none active:scale-[0.98] transition-transform"
            >
              <Image
                src={activeProject.image}
                alt={activeProject.title}
                fill
                unoptimized
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 360px"
              />
              {/* Project Index Overlay Badge */}
              <div className="absolute top-3 right-3 font-mono text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10">
                0{activeIndex + 1} / 0{total}
              </div>
            </div>

            {/* Navigation Controls: Arrows and Dots */}
            <div className="flex items-center justify-between mt-4 px-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] active:scale-90 transition-all shadow-sm"
                aria-label="Previous project"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {projectsList.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? "w-6 bg-[var(--text)]"
                        : "w-2 bg-[var(--line)] hover:bg-[var(--muted)]"
                    }`}
                    aria-label={`Go to project ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-2 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] active:scale-90 transition-all shadow-sm"
                aria-label="Next project"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Active Work Info */}
      <Reveal delay={200}>
        <div className="work-info">
          <h3 className="work-info-title" suppressHydrationWarning>{activeProject.title}</h3>
          <p className="work-info-desc" suppressHydrationWarning>{activeProject.description}</p>
          <div className="flex flex-wrap justify-center gap-1.5 mb-5 px-2">
            {activeProject.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--line)]"
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
      </Reveal>
    </section>
  );
}
