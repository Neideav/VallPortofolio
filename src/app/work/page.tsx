"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowUp } from "lucide-react";
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
    title: "FinTrack Pro - Aplikasi Manajemen Keuangan Terpadu & Multi-User",
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
    title: "Shopcart - Modern E-Commerce Platform & Audio Electronics Storefront",
    desc: "Modern e-commerce storefront styled with clean aesthetics featuring dynamic product discovery, search filtering, and responsive shopping cart.",
    category: "Laravel & Blade",
    tech: [
      { name: "Laravel", icon: "/images/tech/laravel.svg" },
      { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg" },
      { name: "SQLite", icon: "/images/tech/sqlite.svg" },
      { name: "PHP", icon: "/images/tech/php.svg" },
    ],
    link: "https://github.com/Neideav/shopcart",
  },
  {
    num: "03",
    title: "Kumo AI — Next-Generation Intelligent Workspace & AI Assistant",
    desc: "Ruang kerja AI generasi baru dengan streaming Server-Sent Events (SSE) berkecepatan tinggi, antarmuka minimalis modern, eksplorasi ide kreatif, dan debugging kode multi-model.",
    category: "AI & FastAPI",
    tech: [
      { name: "React 18", icon: "/images/tech/js.svg" },
      { name: "Vite", icon: "/images/tech/vite.svg" },
      { name: "FastAPI", icon: "/images/tech/fastapi.svg" },
      { name: "Python", icon: "/images/tech/python.svg" },
    ],
    link: "https://github.com/Neideav/KumoAI",
  },
  {
    num: "04",
    title: "Cloud Deployment Infrastructure — AWS, Docker & CI/CD Pipelines",
    desc: "Infrastruktur deployment cloud berbasis AWS dengan orkestrasi multi-container Docker Compose, pipeline Jenkins otomatis, reverse proxy Nginx, dan sistem monitoring zero-downtime.",
    category: "DevOps & Cloud Automation",
    tech: [
      { name: "AWS", icon: "/images/tech/aws.svg" },
      { name: "Docker", icon: "/images/tech/nginx.svg" },
      { name: "Nginx", icon: "/images/tech/nginx.svg" },
      { name: "Linux", icon: "/images/tech/git.svg" },
    ],
    link: "https://github.com/Neideav/cloud-deployment-infra",
  },
  {
    num: "05",
    title: "CTF Training Platform — Isolated Container Sandbox & Cyber Defense",
    desc: "Platform latihan Capture the Flag (CTF) dengan sandbox container Docker terisolasi dinamis untuk pengujian penetrasi etis, sistem scoring real-time SSE, dan keamanan Linux tervaluasi.",
    category: "Cybersecurity & Container Orchestration",
    tech: [
      { name: "Next.js", icon: "/images/tech/ts.svg" },
      { name: "TypeScript", icon: "/images/tech/ts.svg" },
      { name: "Docker", icon: "/images/tech/nginx.svg" },
      { name: "Linux", icon: "/images/tech/git.svg" },
    ],
    link: "https://github.com/Neideav/ctf-platform",
  },
  {
    num: "06",
    title: "Resilient Microservices Gateway — Distributed Reverse Proxy & Rate Limiter",
    desc: "Distributed reverse proxy and API gateway with token bucket rate-limiting, centralized JWT authentication, path routing, and telemetry logs.",
    category: "Backend & Systems Architecture",
    tech: [
      { name: "Node.js", icon: "/images/tech/nodejs.svg" },
      { name: "Redis", icon: "/images/tech/redis.svg" },
      { name: "PostgreSQL", icon: "/images/tech/postgres.svg" },
      { name: "Nginx", icon: "/images/tech/nginx.svg" },
    ],
    link: "https://github.com/Neideav/api-gateway-service",
  },
  {
    num: "07",
    title: "AutoDeploy CI/CD Pipeline — Webhook-Driven Container Builder",
    desc: "Automated continuous delivery pipeline triggering on GitHub releases, building hardened multi-stage Docker images, and managing zero-downtime rolling service restarts.",
    category: "CI/CD & Automation",
    tech: [
      { name: "GitHub Actions", icon: "/images/tech/github.svg" },
      { name: "Docker", icon: "/images/tech/nginx.svg" },
      { name: "Linux", icon: "/images/tech/git.svg" },
    ],
    link: "https://github.com/Neideav/cloud-deployment-infra",
  },
  {
    num: "08",
    title: "Secure Vault Key-Value Store — Encrypted Distributed Storage",
    desc: "In-memory key-value cache engine supporting cryptographic AES-256 field-level encryption, atomic TTL expiration, and TLS client mutual authentication.",
    category: "Security & Systems",
    tech: [
      { name: "Redis", icon: "/images/tech/redis.svg" },
      { name: "Node.js", icon: "/images/tech/nodejs.svg" },
      { name: "Docker", icon: "/images/tech/nginx.svg" },
    ],
    link: "https://github.com/Neideav",
  },
  {
    num: "09",
    title: "System Monitoring & Telemetry Dashboard — Real-time Metrics",
    desc: "Telemetry dashboard visualising real-time CPU quotas, memory heaps, container health, network I/O, and automated alert webhook dispatching.",
    category: "Monitoring & Observability",
    tech: [
      { name: "FastAPI", icon: "/images/tech/fastapi.svg" },
      { name: "Python", icon: "/images/tech/python.svg" },
      { name: "Linux", icon: "/images/tech/git.svg" },
    ],
    link: "https://github.com/Neideav",
  },
  {
    num: "10",
    title: "Reverse Proxy Gateway — High Performance SSL Termination & Balancing",
    desc: "Optimized Nginx edge ingress configuration with HTTP/2 multiplexing, automated Let's Encrypt certificate renewals, rate-limiting zones, and gzip compression.",
    category: "Infrastructure & Networking",
    tech: [
      { name: "Nginx", icon: "/images/tech/nginx.svg" },
      { name: "Cloudflare", icon: "/images/tech/cloudflare.svg" },
      { name: "Linux", icon: "/images/tech/git.svg" },
    ],
    link: "https://github.com/Neideav",
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
          <Reveal delay={0}>
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
