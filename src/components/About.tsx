"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Code2, FlaskConical, Rocket } from "lucide-react";

export function About() {
  const traits = [
    { label: "TRAIT", value: "Problem Solver" },
    { label: "TRAIT", value: "Organized" },
    { label: "TRAIT", value: "Continuous Learner" },
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
          transform: "translate(0px, 0px) rotate(-6deg) scale(1)",
          opacity: 1,
          zIndex: 30,
        };
      case 1:
        return {
          transform: "translate(12px, 10px) rotate(10deg) scale(0.96)",
          opacity: 0.82,
          zIndex: 20,
        };
      case 2:
        return {
          transform: "translate(-8px, 18px) rotate(-14deg) scale(0.92)",
          opacity: 0.55,
          zIndex: 10,
        };
      default:
        return {
          transform: "translate(28px, 16px) rotate(22deg) scale(0.85)",
          opacity: 0,
          zIndex: 5,
        };
    }
  };

  return (
    <section id="about" className="section scroll-mt-28">
      <div className="section-label">ABOUT ME</div>
      <h2 className="section-title">Problem Solver. Systems Engineer.</h2>

      <div className="about-profile-card">
        {/* Profile Header */}
        <div className="about-profile-header">
          <div className="about-profile-image-wrapper">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border border-[var(--line)] shadow-md">
              <Image
                src="/images/profile.png"
                alt="Muhammad Bahruddin Nauvaldy Maulana"
                fill
                sizes="112px"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          <div className="about-profile-info">
            <div className="about-profile-name">
              <span>MUHAMMAD BAHRUDDIN NAUVALDY MAULANA</span>
              <svg
                className="w-5 h-5 text-blue-500 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label="Verified"
              >
                <path
                  fillRule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
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
                  <Code2 className="w-4 h-4 text-[var(--text)]" />
                </span>
                <div className="currently-text">
                  <div className="currently-item-label">Building</div>
                  <div className="currently-item-detail">
                    Web &amp; Cloud Infrastructure
                  </div>
                </div>
              </div>

              <div className="currently-item">
                <span className="currently-icon">
                  <FlaskConical className="w-4 h-4 text-[var(--text)]" />
                </span>
                <div className="currently-text">
                  <div className="currently-item-label">Exploring</div>
                  <div className="currently-item-detail">
                    Linux Security &amp; CTF Defense
                  </div>
                </div>
              </div>

              <div className="currently-item">
                <span className="currently-icon">
                  <Rocket className="w-4 h-4 text-[var(--text)]" />
                </span>
                <div className="currently-text">
                  <div className="currently-item-label">Learning</div>
                  <div className="currently-item-detail">
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
