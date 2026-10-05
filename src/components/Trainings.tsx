"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface TrainingEntry {
  id: string;
  title: string;
  date: string;
  org: string;
  desc: string;
  certificateName: string;
  certificateUrl: string;
  images: string[];
}

const trainingData: TrainingEntry[] = [
  {
    id: "cloud-devops",
    title: "Cloud & DevOps Infrastructure Engineering",
    date: "2026 — Present",
    org: "Infrastructure & CI/CD Development",
    desc: "Architected multi-container production environments deployed on AWS with Docker Compose, automated Jenkins pipelines, and Nginx reverse proxy configurations. Set up automated systemd watchdog monitors, log aggregation, and zero-downtime rolling upgrades.",
    certificateName: "IBM DevOps and Software Engineering",
    certificateUrl: "https://www.credly.com/organizations/ibm",
    images: ["/images/projects/cloudops.png", "/images/projects/shopcart.png", "/images/projects/ctf.png"],
  },
  {
    id: "ctf-competitions",
    title: "National Cybersecurity CTF Competitions",
    date: "2026",
    org: "Competitive Cyber Defense & Ethical Hacking",
    desc: "Competed in rigorous 9-hour Capture the Flag (CTF) national competitions involving hands-on vulnerability exploitation, reverse engineering, web penetration analysis, and dynamic containerized sandbox defense.",
    certificateName: "Competition Finalist Certificate",
    certificateUrl: "https://github.com/Neideav",
    images: ["/images/projects/ctf.png", "/images/projects/cloudops.png", "/images/projects/shopcart.png"],
  },
  {
    id: "backend-systems",
    title: "Full-Stack & Backend Systems Architecture",
    date: "2025 — 2026",
    org: "Database-Driven Applications & REST APIs",
    desc: "Developed modular server-side applications using Laravel (PHP) and Node.js. Designed normalized relational database schemas across MySQL, MariaDB, and PostgreSQL, implementing JWT authentication, RBAC authorization, and secure transaction workflows.",
    certificateName: "IBM Cloud Computing Fundamentals",
    certificateUrl: "https://www.credly.com/organizations/ibm",
    images: ["/images/projects/shopcart.png", "/images/projects/ctf.png", "/images/projects/cloudops.png"],
  },
];

export function Trainings() {
  const [stackIndices, setStackIndices] = useState<Record<string, number>>({
    "cloud-devops": 0,
    "ctf-competitions": 0,
    "backend-systems": 0,
  });

  const cycleImage = (id: string, total: number) => {
    setStackIndices((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % total,
    }));
  };

  const getImageStyle = (entryIndex: number, imgIndex: number, currentTop: number, total: number) => {
    const diff = (imgIndex - currentTop + total) % total;
    if (diff === 0) {
      return {
        transform: "translate(0px, 0px) rotate(0deg) scale(1)",
        opacity: 1,
        zIndex: 30,
      };
    }
    if (diff === 1) {
      return {
        transform: "translate(12px, -8px) rotate(3.5deg) scale(0.94)",
        opacity: 0.75,
        zIndex: 20,
      };
    }
    return {
      transform: "translate(24px, 16px) rotate(-4.2deg) scale(0.88)",
      opacity: 0.55,
      zIndex: 10,
    };
  };

  return (
    <section id="trainings" className="section">
      <div className="section-label">Growth &amp; Experience</div>
      <h2 className="section-title">Trainings &amp; Experience</h2>
      <p className="section-desc">
        A collection of technical milestones, cybersecurity competitions, and engineering projects
        that shaped my technical and collaborative skills.
      </p>

      <div className="experience-list">
        {trainingData.map((entry, index) => {
          const isReverse = index % 2 !== 0;
          const currentTop = stackIndices[entry.id] || 0;

          return (
            <div
              key={entry.id}
              className={`experience-card ${isReverse ? "experience-card-reverse" : ""}`}
            >
              {/* Text Side */}
              <div className="experience-text">
                <div className="experience-header flex justify-between items-start gap-4 mb-2">
                  <div className="experience-title">{entry.title}</div>
                  <div className="experience-date">{entry.date}</div>
                </div>

                <div className="experience-org">{entry.org}</div>
                <div className="experience-desc">{entry.desc}</div>

                <div>
                  <a
                    href={entry.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="experience-certificate"
                  >
                    <span>{entry.certificateName}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 inline" />
                  </a>
                </div>
              </div>

              {/* Interactive Image Stack Side */}
              <div
                className="experience-image-stack"
                onClick={() => cycleImage(entry.id, entry.images.length)}
                title="Click image to cycle stack"
              >
                {entry.images.map((imgSrc, imgIndex) => {
                  const style = getImageStyle(index, imgIndex, currentTop, entry.images.length);
                  return (
                    <div
                      key={imgIndex}
                      className="stacked-image"
                      style={style}
                    >
                      <Image
                        src={imgSrc}
                        alt={`${entry.title} screenshot`}
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 100vw, 500px"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
