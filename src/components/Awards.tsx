"use client";

import React from "react";
import Image from "next/image";
import { Trophy, Award, ExternalLink, ShieldCheck, GraduationCap } from "lucide-react";

interface AwardItem {
  id: string;
  title: string;
  provider: string;
  link: string;
  icon: "trophy" | "award" | "shield" | "cap";
}

const awardsList: AwardItem[] = [
  {
    id: "ctf-finalist",
    title: "National Cybersecurity Competition Finalist",
    provider: "National CTF Committee",
    link: "https://github.com/Neideav",
    icon: "trophy",
  },
  {
    id: "ibm-devops",
    title: "IBM DevOps and Software Engineering",
    provider: "IBM Credential",
    link: "https://www.credly.com/organizations/ibm",
    icon: "award",
  },
  {
    id: "ibm-cloud",
    title: "IBM Cloud Computing Fundamentals",
    provider: "IBM Credential",
    link: "https://www.credly.com/organizations/ibm",
    icon: "award",
  },
  {
    id: "aws-infra",
    title: "AWS Cloud Infrastructure & Services",
    provider: "Cloud Architecture Foundations",
    link: "https://aws.amazon.com/certification/",
    icon: "shield",
  },
  {
    id: "cs-degree",
    title: "Dean's Lister & Academic Honors",
    provider: "Informatics & Computer Science",
    link: "https://github.com/Neideav",
    icon: "cap",
  },
];

export function Awards() {
  const getIcon = (type: AwardItem["icon"]) => {
    switch (type) {
      case "trophy":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case "award":
        return <Award className="w-5 h-5 text-emerald-500" />;
      case "shield":
        return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case "cap":
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <section id="awards" className="section">
      <div className="section-label">Recognition</div>
      <h2 className="section-title">Awards and Achievements</h2>
      <p className="section-desc">
        A collection of competition recognitions and verified credentials that reflect my dedication
        to engineering excellence.
      </p>

      <div className="awards-layout">
        {/* Left: Trophy Graphic */}
        <div className="relative w-full max-w-[580px] h-[340px] sm:h-[400px] rounded-2xl overflow-hidden border border-[var(--line)] shadow-2xl">
          <Image
            src="/images/awards/awards.png"
            alt="Awards and Achievements"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 580px"
          />
        </div>

        {/* Right: Awards Column */}
        <div className="awards-column">
          {awardsList.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="award-item"
            >
              <div className="award-icon">{getIcon(item.icon)}</div>
              <div>
                <div className="award-title">{item.title}</div>
                <div className="font-mono text-[11px] text-[var(--muted)]">
                  {item.provider}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 ml-auto text-[var(--muted)] shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
