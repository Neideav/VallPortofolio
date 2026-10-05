"use client";

import React from "react";
import Image from "next/image";
import { Trophy, ExternalLink, ShieldCheck, GraduationCap } from "lucide-react";

interface AwardItem {
  id: string;
  title: string;
  link: string;
  icon: "cap" | "trophy" | "shield";
}

const awardsList: AwardItem[] = [
  {
    id: "deans-lister",
    title: "Dean's Lister",
    link: "https://github.com/Neideav",
    icon: "cap",
  },
  {
    id: "jhic-top30",
    title: "Top 30 Nasional — Jagoan Hosting Infra Competition",
    link: "https://drive.google.com/file/d/1h10-ihrs3HlE0CYKEYV1HAmIz0HE3F2B/view?usp=sharing",
    icon: "trophy",
  },
  {
    id: "best-capstone",
    title: "Best Capstone System & Architecture",
    link: "https://github.com/Neideav",
    icon: "trophy",
  },
  {
    id: "confluent-certified",
    title: "Confluent Certified Data Streaming Engineer",
    link: "https://certificates.confluent.io/ca9e0ec3-3477-4e96-a728-6b7a780215f5#acc.6g2t0FeD",
    icon: "shield",
  },
];

export function Awards() {
  const getIcon = (type: AwardItem["icon"]) => {
    switch (type) {
      case "cap":
        return <GraduationCap className="w-5 h-5 text-zinc-300" />;
      case "trophy":
        return <Trophy className="w-5 h-5 text-zinc-300" />;
      case "shield":
        return <ShieldCheck className="w-5 h-5 text-zinc-300" />;
    }
  };

  return (
    <section id="awards" className="section scroll-mt-28">
      <div className="section-label">RECOGNITION</div>
      <h2 className="section-title">Awards and Achievements</h2>
      <p className="section-desc">
        A collection of academic and professional recognitions that reflect my dedication to excellence.
      </p>

      <div className="awards-layout">
        {/* Left: Asymmetrical Staggered Photo Collage */}
        <div className="collage-container">
          {/* Column 1 */}
          <div className="collage-column">
            <div className="collage-item h-[240px]">
              <Image
                src="/images/awards/jhic-cert.jpg"
                alt="Sertifikat Top 30 Nasional Jagoan Hosting Infra Competition 2025"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover object-center"
              />
              <div className="collage-overlay" />
              <span className="collage-badge">Top 30 Nasional // JHIC 2025</span>
            </div>

            <div className="collage-item h-[280px]">
              <Image
                src="/images/awards/award-ceremony.jpg"
                alt="Championship Award Ceremony"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover object-top"
              />
              <div className="collage-overlay" />
              <span className="collage-badge">National Stage // Infra Competition</span>
            </div>
          </div>

          {/* Column 2 (Offset / Staggered) */}
          <div className="collage-column collage-column--offset">
            <div className="collage-item h-[280px]">
              <Image
                src="/images/awards/academic-honors.jpg"
                alt="Academic Honors Graduate"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover object-top"
              />
              <div className="collage-overlay" />
              <span className="collage-badge">Bachelor with Honors</span>
            </div>

            <div className="collage-item h-[240px]">
              <Image
                src="/images/awards/hackathon-booth.jpg"
                alt="Cloud Architecture Showcase Booth"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover object-center"
              />
              <div className="collage-overlay" />
              <span className="collage-badge">Architecture Showcase</span>
            </div>
          </div>
        </div>

        {/* Right: Awards Column */}
        <div className="awards-column">
          {awardsList.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="award-card group"
            >
              <div className="award-card-left">
                <div className="award-card-icon">{getIcon(item.icon)}</div>
                <div className="award-card-title">{item.title}</div>
              </div>
              <ExternalLink className="award-card-arrow w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
