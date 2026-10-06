"use client";

import React from "react";
import { Reveal } from "./Reveal";
import { FadeInTitle } from "./FadeInTitle";
import {
  BentoCodingVisual,
  BentoSupportVisual,
} from "./TechLogos";

// Tech stack items directly matched with https://github.com/Neideav/Neideav.git
const techColumns = [
  // Column 1: Programming Languages
  [
    { name: "Python", icon: "/images/tech/python.svg" },
    { name: "TypeScript", icon: "/images/tech/ts.svg" },
    { name: "JavaScript", icon: "/images/tech/js.svg" },
    { name: "PHP", icon: "/images/tech/php.svg" },
    { name: "Java", icon: "/images/tech/java.svg" },
    { name: "C++", icon: "/images/tech/cpp.svg" },
  ],
  // Column 2: Frameworks & Backend
  [
    { name: "Node.js", icon: "/images/tech/nodejs.svg" },
    { name: "Laravel", icon: "/images/tech/laravel.svg" },
    { name: "FastAPI", icon: "/images/tech/fastapi.svg" },
    { name: ".NET", icon: "/images/tech/dotnet.svg" },
    { name: "Vue.js", icon: "/images/tech/vue.svg" },
    { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg" },
  ],
  // Column 3: Databases & Web Servers
  [
    { name: "MySQL", icon: "/images/tech/mysql.svg" },
    { name: "PostgreSQL", icon: "/images/tech/postgres.svg" },
    { name: "Redis", icon: "/images/tech/redis.svg" },
    { name: "MariaDB", icon: "/images/tech/mariadb.svg" },
    { name: "Nginx", icon: "/images/tech/nginx.svg" },
    { name: "Apache", icon: "/images/tech/apache.svg" },
  ],
  // Column 4: Cloud, DevOps & Tools
  [
    { name: "AWS", icon: "/images/tech/aws.svg" },
    { name: "Azure", icon: "/images/tech/azure.svg" },
    { name: "Cloudflare", icon: "/images/tech/cloudflare.svg" },
    { name: "Vercel", icon: "/images/tech/vercel.svg" },
    { name: "Git", icon: "/images/tech/git.svg" },
    { name: "GitHub", icon: "/images/tech/github.svg" },
  ],
];

export function WhatICanDo() {
  return (
    <section id="what-i-can-do" className="section">
      <div className="what-i-can-do-grid">
        {/* Left Side */}
        <div className="what-i-can-do-left">
          <Reveal delay={0}>
            <div className="section-label">MY CAPABILITIES</div>
            <FadeInTitle text="What I Can Do" />
            <p className="what-i-can-do-desc">
              I combine cloud architecture, backend development, and cybersecurity skills to build
              reliable systems, scalable APIs, and secure digital infrastructure.
            </p>

            {/* Tech Stack Columns matching Neideav GitHub README */}
            <div className="tech-stack">
              {techColumns.map((col, colIdx) => (
                <div
                  key={colIdx}
                  className={`tech-stack-column ${colIdx >= 2 ? "workspace-column" : ""}`}
                >
                  {col.map((item) => (
                    <div key={item.name} className="tech-stack-item group" title={item.name}>
                      <img
                        src={item.icon}
                        alt={item.name}
                        width={30}
                        height={30}
                        loading="lazy"
                        draggable="false"
                        className="tech-icon-img"
                      />
                      <span className="tech-stack-label">{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right Side: 2 Bento Cards matching skillset */}
        <div className="what-i-can-do-right">
          {/* Bento Card 01 */}
          <Reveal delay={150}>
            <div className="bento-card bento-large">
              <div className="bento-header">
                <div className="bento-number">01</div>
                <div className="bento-category">CLOUD &amp; BACKEND SYSTEMS</div>
              </div>

              <div className="bento-visual">
                <BentoCodingVisual />
              </div>

              <p className="bento-desc">
                Designing and architecting scalable backend APIs, distributed cloud architectures, and
                automated CI/CD pipelines with high availability, reliability, and security in mind.
              </p>

              <div className="bento-skills">
                <span className="bento-tag">Cloud Architecture</span>
                <span className="bento-tag">Backend Systems</span>
                <span className="bento-tag">DevOps &amp; CI/CD</span>
                <span className="bento-tag">API Development</span>
                <span className="bento-tag">Python</span>
                <span className="bento-tag">Node.js</span>
                <span className="bento-tag">Laravel</span>
                <span className="bento-tag">FastAPI</span>
                <span className="bento-tag">AWS &amp; Azure</span>
                <span className="bento-tag">PostgreSQL</span>
                <span className="bento-tag">Docker</span>
                <span className="bento-tag">Nginx</span>
              </div>
            </div>
          </Reveal>

          {/* Bento Card 02 */}
          <Reveal delay={270}>
            <div className="bento-card bento-medium">
              <div className="bento-header">
                <div className="bento-number">02</div>
                <div className="bento-category">FULL-STACK &amp; CYBERSECURITY</div>
              </div>

              <div className="bento-visual">
                <BentoSupportVisual />
              </div>

              <p className="bento-desc">
                Developing secure full-stack applications, analyzing system vulnerabilities through
                Capture the Flag (CTF) challenges, and managing database infrastructure.
              </p>

              <div className="bento-skills">
                <span className="bento-tag">Cybersecurity (CTF)</span>
                <span className="bento-tag">Vulnerability Assessment</span>
                <span className="bento-tag">Full-Stack Development</span>
                <span className="bento-tag">Vue.js &amp; Tailwind</span>
                <span className="bento-tag">TypeScript</span>
                <span className="bento-tag">Database Management</span>
                <span className="bento-tag">Redis Caching</span>
                <span className="bento-tag">Git &amp; GitHub</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
