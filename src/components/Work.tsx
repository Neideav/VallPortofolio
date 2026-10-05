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
    id: "shopcart",
    title: "Shopcart - Full-Stack E-Commerce & AWS Cloud Infrastructure",
    description: "Architected a high-concurrency e-commerce application deployed on AWS with Laravel, React, Docker, and managed database infrastructure with Redis caching and zero-downtime Nginx routing.",
    image: "/images/projects/shopcart.png",
    link: "https://github.com/Neideav/shopcart",
    tags: ["Laravel", "React", "Docker", "AWS", "RDS", "MySQL"],
  },
  {
    id: "ctf",
    title: "HackDefend CTF - Cybersecurity Training Platform & Sandboxing",
    description: "Cybersecurity training platform built around isolated challenge containers, automated flag cryptographic verification, network bridge isolation, and live scoring telemetry.",
    image: "/images/projects/ctf.png",
    link: "https://github.com/Neideav/ctf-platform",
    tags: ["Next.js", "TypeScript", "Docker", "Linux", "Cybersecurity"],
  },
  {
    id: "cloudops",
    title: "CloudOps Insight - Container Deployment & CI/CD Infrastructure",
    description: "Automated multi-stage application delivery pipeline using Jenkins CI/CD, Docker container orchestration, systemd watchdogs, and Nginx reverse proxy routing.",
    image: "/images/projects/cloudops.png",
    link: "https://github.com/Neideav/cloud-deployment-infra",
    tags: ["AWS", "Docker", "Linux", "CI/CD", "Jenkins"],
  },
  {
    id: "api-gateway",
    title: "Resilient Microservices Edge API Gateway",
    description: "Distributed reverse proxy and API gateway with token-bucket rate limiting backed by Redis, centralized JWT verification, and structured JSON logs.",
    image: "/images/projects/shopcart.png",
    link: "https://github.com/Neideav",
    tags: ["Node.js", "Docker", "Nginx", "Redis", "PostgreSQL"],
  },
  {
    id: "linux-sec",
    title: "Hardened Linux Server & Telemetry Automation",
    description: "Automated bash telemetry scripts, firewall iptables hardening, and centralized log aggregation for production Linux hosting environments.",
    image: "/images/projects/ctf.png",
    link: "https://github.com/Neideav",
    tags: ["Linux", "Bash", "Security", "Nginx", "CloudWatch"],
  },
];

export function Work() {
  const [activeIndex, setActiveIndex] = useState(1);

  const getPositionStyle = (index: number) => {
    const diff = (index - activeIndex + workProjects.length) % workProjects.length;

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
        transform: "translate(calc(-50% + 200px), -50%) scale(0.72)",
        zIndex: 4,
        opacity: 0.85,
        pointerEvents: "auto" as const,
      };
    }
    // Far Right
    if (diff === 2) {
      return {
        transform: "translate(calc(-50% + 330px), -50%) scale(0.55)",
        zIndex: 3,
        opacity: 0.3,
        pointerEvents: "auto" as const,
      };
    }
    // Near Left
    if (diff === workProjects.length - 1) {
      return {
        transform: "translate(calc(-50% - 200px), -50%) scale(0.72)",
        zIndex: 4,
        opacity: 0.85,
        pointerEvents: "auto" as const,
      };
    }
    // Far Left
    if (diff === workProjects.length - 2) {
      return {
        transform: "translate(calc(-50% - 330px), -50%) scale(0.55)",
        zIndex: 3,
        opacity: 0.3,
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
    const diff = (index - activeIndex + workProjects.length) % workProjects.length;
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
          opacity: 0.75,
          zIndex: 20,
        };
      case 2:
        return {
          transform: "translate(14px, 17.6px) rotate(6.6deg) scale(0.88)",
          opacity: 0.55,
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
