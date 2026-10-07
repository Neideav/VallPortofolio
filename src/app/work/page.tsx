"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ExternalLink, 
  ArrowUp, 
  ArrowLeft 
} from "lucide-react";
import { BackgroundLines } from "@/components/BackgroundLines";
import { Navbar } from "@/components/Navbar";
import { CoffeeButton } from "@/components/CoffeeButton";
import { Reveal } from "@/components/Reveal";
import { FadeInTitle } from "@/components/FadeInTitle";

interface ArchiveProject {
  num: string;
  title: string;
  desc: string;
  category: string;
  tech: { name: string; icon?: string }[];
  link: string;
}

interface DigitalProject {
  num: string;
  title: string;
  desc: string;
  image: string;
}

const technicalProjects: ArchiveProject[] = [
  {
    num: "01",
    title: "FinTrack Pro — Aplikasi Manajemen Keuangan Terpadu & Multi-User",
    desc: "Aplikasi web manajemen keuangan pribadi & grup yang dilengkapi analisis arus kas, budgeting bulanan, target tabungan, otomatisasi transaksi berulang, serta audit trail keamanan finansial.",
    category: "Fullstack Web App",
    tech: [
      { name: "React", icon: "/images/tech/js.svg" },
      { name: "Express.js", icon: "/images/tech/nodejs.svg" },
      { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg" },
      { name: "MySQL", icon: "/images/tech/mysql.svg" },
    ],
    link: "https://github.com/Neideav/fintrack-pro",
  },
  {
    num: "02",
    title: "Shopcart — Modern E-Commerce Platform & Shopping Cart Engine",
    desc: "Aplikasi e-commerce modern dengan arsitektur modular, dynamic product discovery, keranjang belanja real-time, filter kategori, dan antarmuka responsif elegan.",
    category: "TypeScript & E-Commerce",
    tech: [
      { name: "TypeScript", icon: "/images/tech/ts.svg" },
      { name: "React", icon: "/images/tech/js.svg" },
      { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg" },
      { name: "Vite", icon: "/images/tech/vite.svg" },
    ],
    link: "https://github.com/Neideav/shopcart",
  },
  {
    num: "03",
    title: "KumoAI — Intelligent ChatBot Project & Conversational AI",
    desc: "ChatBot Project interaktif berbasis integrasi model AI canggih, streaming respon percakapan, arsitektur kode modular, dan antarmuka interaktif responsif.",
    category: "AI & Intelligent Systems",
    tech: [
      { name: "JavaScript", icon: "/images/tech/js.svg" },
      { name: "Java", icon: "/images/tech/java.svg" },
      { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg" },
      { name: "Node.js", icon: "/images/tech/nodejs.svg" },
    ],
    link: "https://github.com/Neideav/KumoAI",
  },
  {
    num: "04",
    title: "ProjectShyeunD — Native Android Mobile Application",
    desc: "Aplikasi mobile Android native yang dikembangkan menggunakan bahasa Kotlin, mengimplementasikan lifecycle management modern, UI components intuitif, dan clean code structure.",
    category: "Android Mobile Development",
    tech: [
      { name: "Kotlin", icon: "/images/tech/kotlin.svg" },
      { name: "Git", icon: "/images/tech/git.svg" },
      { name: "GitHub", icon: "/images/tech/github.svg" },
    ],
    link: "https://github.com/Neideav/ProjectShyeunD",
  },
  {
    num: "05",
    title: "vallonation — Reactive Web Application & Creative Platform",
    desc: "Platform web responsif yang dibangun dengan TypeScript dan ekosistem modern, memadukan antarmuka pengguna interaktif dan arsitektur kode modular.",
    category: "Web Application & Platform",
    tech: [
      { name: "TypeScript", icon: "/images/tech/ts.svg" },
      { name: "React", icon: "/images/tech/js.svg" },
      { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg" },
      { name: "Git", icon: "/images/tech/git.svg" },
    ],
    link: "https://github.com/Neideav/vallonation",
  },
  {
    num: "06",
    title: "MyPorto — Personal Portfolio & Interactive Web Platform",
    desc: "Aplikasi web portofolio dengan transisi halus, state management dinamis, tema kustom, dan tata letak responsif modern.",
    category: "Frontend & Portfolio Engine",
    tech: [
      { name: "TypeScript", icon: "/images/tech/ts.svg" },
      { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg" },
      { name: "HTML5", icon: "/images/tech/html.svg" },
      { name: "Vite", icon: "/images/tech/vite.svg" },
    ],
    link: "https://github.com/Neideav/MyPorto",
  },
  {
    num: "07",
    title: "VallPortofolio — Production Cloud Engineer & DevOps Portfolio",
    desc: "Portofolio web produksi modern dengan Next.js App Router, SSR hydration-safe state store, real-time coffee counter API, dan arsitektur responsif premium.",
    category: "Fullstack & Cloud Architecture",
    tech: [
      { name: "TypeScript", icon: "/images/tech/ts.svg" },
      { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg" },
      { name: "Node.js", icon: "/images/tech/nodejs.svg" },
      { name: "Vercel", icon: "/images/tech/vercel.svg" },
    ],
    link: "https://github.com/Neideav/VallPortofolio",
  },
  {
    num: "08",
    title: "ai-agent-book — AI Agent Design Principles & Engineering Practices",
    desc: "Repositori eksplorasi mendalam mengenai prinsip arsitektur AI Agent, autonomous agent workflow, integrasi LLM, dan rekayasa prompt sistem otonom.",
    category: "AI Architecture & Engineering",
    tech: [
      { name: "Python", icon: "/images/tech/python.svg" },
      { name: "Git", icon: "/images/tech/git.svg" },
      { name: "GitHub", icon: "/images/tech/github.svg" },
    ],
    link: "https://github.com/Neideav/ai-agent-book",
  },
  {
    num: "09",
    title: "wakawaka — Interactive Web Game & Animation Engine",
    desc: "Aplikasi web interaktif dengan logika game dinamis, penanganan event input real-time, dan manipulasi elemen visual yang responsif pada peramban web.",
    category: "Interactive Web & Game Logic",
    tech: [
      { name: "JavaScript", icon: "/images/tech/js.svg" },
      { name: "HTML5", icon: "/images/tech/html.svg" },
      { name: "Git", icon: "/images/tech/git.svg" },
    ],
    link: "https://github.com/Neideav/wakawaka",
  },
  {
    num: "10",
    title: "Neideav — Developer Profile & Identity Configuration",
    desc: "Repositori konfigurasi profil GitHub dengan metrik statistik coding real-time, workflow otomasi CI/CD, dan kurasi identitas teknis pengembang.",
    category: "Developer Tooling & Configuration",
    tech: [
      { name: "GitHub", icon: "/images/tech/github.svg" },
      { name: "Git", icon: "/images/tech/git.svg" },
      { name: "Cloudflare", icon: "/images/tech/cloudflare.svg" },
    ],
    link: "https://github.com/Neideav/Neideav",
  },
];

const digitalProjects: DigitalProject[] = [
  {
    num: "01",
    title: "Creative Design Collection",
    desc: "A collection of original digital assets, templates, and visual elements created for marketing, branding, and content production.",
    image: "/images/digital/creative.png",
  },
  {
    num: "02",
    title: "Creative Resource Workspace",
    desc: "A digital workspace designed to organize creative resources, references, and design assets for efficient content production.",
    image: "/images/digital/workspace.png",
  },
  {
    num: "03",
    title: "Content Management System",
    desc: "A structured workspace designed to organize content, manage production tasks, and coordinate the workflow from planning to publication.",
    image: "/images/digital/content.png",
  },
  {
    num: "04",
    title: "Content Planning & Scheduling",
    desc: "A visual content planning system designed to organize social media posts, schedules, and publishing activities for consistent content delivery.",
    image: "/images/digital/schedule.png",
  },
  {
    num: "05",
    title: "Social Media Content Kit",
    desc: "A collection of social media templates, graphics, and caption frameworks designed to maintain consistent and engaging brand content.",
    image: "/images/digital/social.png",
  },
];

export default function WorkPage() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="portfolio-root relative min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-400">
      {/* Background SVG curved topographic lines */}
      <BackgroundLines />

      {/* Floating Coffee button */}
      <CoffeeButton alwaysVisible={true} />

      {/* Navigation Bar */}
      <Navbar />

      <main style={{ position: "relative" }}>
        {/* Technical Archive Section */}
        <section className="archive-section" id="technical">
          {/* Breadcrumb Top Bar */}
          <Reveal delay={0}>
            <div className="archive-top-bar">
              <Link href="/#work" className="archive-back-btn group">
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Return to Portfolio</span>
              </Link>
            </div>
          </Reveal>

          {/* Section Header */}
          <Reveal delay={50}>
            <div className="archive-header">
              <div className="archive-header-left">
                <div className="section-label">Archive</div>
                <FadeInTitle text="Technical Projects" />
                <p className="archive-description">
                  A complete collection of my technical work, systems, and digital projects.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Content Area: Technical Projects List */}
          <Reveal delay={100}>
            <div className="archive-list">
              {technicalProjects.map((project) => (
                <a
                  key={project.num}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="archive-row group"
                >
                  <span className="archive-row-num">{project.num}</span>

                  <div className="archive-row-main">
                    <div className="archive-row-title group-hover:text-amber-500 transition-colors">
                      {project.title}
                    </div>
                    <div className="archive-row-desc">{project.desc}</div>

                    <div className="archive-row-tags">
                      <span className="archive-row-category">{project.category}</span>
                      <div className="archive-row-tech">
                        {project.tech.map((t, idx) => (
                          <span key={idx} className="archive-tag">
                            {t.icon && (
                              <Image
                                src={t.icon}
                                alt={t.name}
                                width={15}
                                height={15}
                                className="archive-tag-img"
                                unoptimized
                              />
                            )}
                            <span>{t.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="archive-row-action group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Digital Projects Section */}
        <section className="digital-section" id="digital">
          <Reveal delay={0}>
            <div className="digital-header">
              <div className="section-label">Digital Projects</div>
              <FadeInTitle text="Beyond Code" />
              <p className="section-desc">
                Creative, visual, content, and digital projects developed alongside my technical work.
              </p>
            </div>
          </Reveal>

          {/* Hero Digital Card */}
          <Reveal delay={100}>
            <div className="digital-card digital-card--hero">
              <div className="digital-image-wrap--hero">
                <Image
                  src={digitalProjects[0].image}
                  alt={digitalProjects[0].title}
                  width={800}
                  height={500}
                  unoptimized
                  className="digital-image"
                />
              </div>
              <div className="digital-content digital-content--hero">
                <span className="digital-hero-num" aria-hidden="true">
                  {digitalProjects[0].num}
                </span>
                <h3 className="digital-title text-xl font-bold mb-3">
                  {digitalProjects[0].title}
                </h3>
                <p className="digital-desc text-sm">
                  {digitalProjects[0].desc}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Grid of Remaining Digital Cards */}
          <Reveal delay={150}>
            <div className="digital-grid">
              {digitalProjects.slice(1).map((item) => (
                <div key={item.num} className="digital-card">
                  <div className="digital-image-wrap">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={600}
                      height={400}
                      unoptimized
                      className="digital-image"
                    />
                  </div>
                  <div className="digital-content digital-content--grid">
                    <span className="digital-grid-num" aria-hidden="true">
                      {item.num}
                    </span>
                    <h3 className="digital-title">{item.title}</h3>
                    <p className="digital-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Work CTA Section */}
        <section className="work-cta">
          <div className="work-cta-inner">
            <Reveal delay={0}>
              <div className="work-cta-eyebrow">HAVE A PROJECT IN MIND?</div>
            </Reveal>

            <Reveal delay={100}>
              <div className="work-cta-main">
                <h2 className="work-cta-heading">Let&apos;s build something useful.</h2>
                <Link className="work-cta-button" href="/#contact">
                  Hire Me &rarr;
                </Link>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="work-cta-meta">
                <span>&copy; 2026 MUHAMMAD BAHRUDDIN NAUVALDY MAULANA</span>
                <span>CLOUD ENGINEER &middot; BACKEND &middot; DEVOPS</span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Floating Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
