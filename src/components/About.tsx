"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Code2, FlaskConical, Rocket } from "lucide-react";

export function About() {
  const traits = [
    { label: "TRAIT", value: "Problem Solver" },
    { label: "TRAIT", value: "Automation-Driven" },
    { label: "TRAIT", value: "Security-First" },
    { label: "TRAIT", value: "High Availability" },
  ];

  const [topIndex, setTopIndex] = useState(0);

  const cycleCard = () => {
    setTopIndex((prev) => (prev + 1) % traits.length);
  };

  const getCardStyle = (index: number) => {
    const diff = (index - topIndex + traits.length) % traits.length;
    switch (diff) {
      case 0:
        return {
          transform: "translate(6px, -4px) rotate(-7deg) scale(1)",
          opacity: 1,
          zIndex: 30,
        };
      case 1:
        return {
          transform: "translate(2px, 11px) rotate(10deg) scale(0.955)",
          opacity: 0.75,
          zIndex: 20,
        };
      case 2:
        return {
          transform: "translate(30px, 22px) rotate(-13deg) scale(0.91)",
          opacity: 0.55,
          zIndex: 10,
        };
      default:
        return {
          transform: "translate(134px, -67px) rotate(43deg) scale(0.85)",
          opacity: 0,
          zIndex: 5,
        };
    }
  };

  return (
    <section id="about" className="section">
      <div className="section-label">ABOUT ME</div>
      <h2 className="section-title">Problem Solver. Systems Engineer.</h2>

      <div className="about-profile-card">
        {/* Profile Header */}
        <div className="about-profile-header">
          <div className="about-profile-image-wrapper">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-[var(--line)] shadow-lg">
              <Image
                src="/images/profile.png"
                alt="Muhammad Bahruddin Nauvaldy Maulana"
                fill
                sizes="112px"
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="about-profile-info">
            <div className="about-profile-name">
              <span>MUHAMMAD BAHRUDDIN NAUVALDY MAULANA</span>
              <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/20" />
            </div>

            <div className="about-profile-stats">
              <div className="about-stat-item">
                <span className="about-stat-label">PROJECTS</span>
                <span className="about-stat-value">10+</span>
              </div>
              <div className="about-stat-item">
                <span className="about-stat-label">CERTIFICATES</span>
                <span className="about-stat-value">5+</span>
              </div>
              <div className="about-stat-item">
                <span className="about-stat-label">SPECIALIZATION</span>
                <span className="about-stat-value">CLOUD &amp; DEVOPS</span>
              </div>
            </div>

            <div className="about-description">
              <p>
                I am a developer focused on cloud infrastructure, backend engineering, and automated
                DevOps delivery pipelines. I enjoy turning complex system requirements into reliable,
                predictable, and scalable software solutions—specializing in AWS deployments, container
                orchestration with Docker, and robust backend architectures with Laravel and Node.js.
              </p>
              <p>
                Throughout my technical journey, I have built database-driven applications, established
                zero-downtime CI/CD workflows with Jenkins and Nginx, and actively competed in national
                cybersecurity Capture the Flag (CTF) competitions, emphasizing defensive hardening and
                network isolation.
              </p>
              <p>
                Want to know more about my experience?{" "}
                <a
                  href="#contact"
                  className="font-semibold text-[var(--text)] underline underline-offset-4 hover:opacity-75 transition-opacity"
                >
                  Download my resume
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row: Currently Strip & Interactive Card Stack */}
        <div className="about-bottom-row">
          {/* Left: Currently Strip */}
          <div className="currently-strip">
            <div className="currently-strip-label">CURRENTLY</div>
            <div className="currently-strip-items">
              <div className="currently-item">
                <span className="currently-icon">
                  <Code2 className="w-4 h-4 text-emerald-500" />
                </span>
                <div className="currently-text">
                  <div className="currently-item-label">Building</div>
                  <div className="currently-item-detail text-xs text-[var(--muted)]">
                    Web &amp; Cloud Infrastructure
                  </div>
                </div>
              </div>

              <div className="currently-item">
                <span className="currently-icon">
                  <FlaskConical className="w-4 h-4 text-emerald-500" />
                </span>
                <div className="currently-text">
                  <div className="currently-item-label">Exploring</div>
                  <div className="currently-item-detail text-xs text-[var(--muted)]">
                    Linux Security &amp; CTF Defense
                  </div>
                </div>
              </div>

              <div className="currently-item">
                <span className="currently-icon">
                  <Rocket className="w-4 h-4 text-emerald-500" />
                </span>
                <div className="currently-text">
                  <div className="currently-item-label">Learning</div>
                  <div className="currently-item-detail text-xs text-[var(--muted)]">
                    Distributed Systems &amp; K8s
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Card Stack */}
          <div
            className="card-stack"
            onClick={cycleCard}
            title="Click to cycle traits"
          >
            {traits.map((trait, index) => {
              const style = getCardStyle(index);
              return (
                <div
                  key={trait.value}
                  className="card-stack-card"
                  style={style}
                >
                  <div className="card-stack-label">{trait.label}</div>
                  <div className="card-stack-value">{trait.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
