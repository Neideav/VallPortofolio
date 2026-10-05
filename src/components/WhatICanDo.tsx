"use client";

import React from "react";
import { Cloud, Server, GitBranch, Shield, Database, Terminal, Cpu } from "lucide-react";

export function WhatICanDo() {
  const column1 = ["AWS", "Docker", "Linux", "Jenkins", "Nginx"];
  const column2 = ["Laravel", "PHP", "Node.js", "REST API", "Express"];
  const column3 = ["MySQL", "PostgreSQL", "MariaDB", "Redis", "Git"];
  const column4 = ["React", "Next.js", "TypeScript", "Tailwind", "Python"];

  return (
    <section id="what-i-can-do" className="section">
      <div className="what-i-can-do-grid">
        {/* Left Side */}
        <div className="what-i-can-do-left">
          <div className="section-label">My Capabilities</div>
          <h2 className="section-title">What I Can Do</h2>
          <p className="what-i-can-do-desc">
            I combine cloud infrastructure, server-side development, and DevOps automation to
            build resilient systems, manage distributed data stores, and streamline deployment workflows.
          </p>

          {/* Tech Stack Columns with hover tooltips */}
          <div className="tech-stack">
            <div className="tech-stack-column">
              {column1.map((item) => (
                <div key={item} className="tech-stack-item group">
                  <span>{item}</span>
                  <span className="tech-stack-label">Tool // {item}</span>
                </div>
              ))}
            </div>

            <div className="tech-stack-column">
              {column2.map((item) => (
                <div key={item} className="tech-stack-item group">
                  <span>{item}</span>
                  <span className="tech-stack-label">Stack // {item}</span>
                </div>
              ))}
            </div>

            <div className="tech-stack-column">
              {column3.map((item) => (
                <div key={item} className="tech-stack-item group">
                  <span>{item}</span>
                  <span className="tech-stack-label">Store // {item}</span>
                </div>
              ))}
            </div>

            <div className="tech-stack-column hidden sm:flex">
              {column4.map((item) => (
                <div key={item} className="tech-stack-item group">
                  <span>{item}</span>
                  <span className="tech-stack-label">Client // {item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Bento Cards */}
        <div className="what-i-can-do-right">
          {/* Bento Card 1 */}
          <div className="bento-card">
            <div className="bento-header flex justify-between items-start mb-4">
              <div className="bento-number">01</div>
              <div className="bento-category">Cloud Engineering &amp; DevOps</div>
            </div>

            <div className="bento-visual my-4 flex items-center justify-center text-emerald-400">
              <Cloud className="w-12 h-12 stroke-[1.5]" />
            </div>

            <p className="bento-desc">
              Designing, provisioning, and maintaining cloud infrastructure on AWS. Configuring
              automated Jenkins &amp; GitHub Actions CI/CD pipelines, containerized Docker workloads,
              reverse proxies, and Linux server monitoring.
            </p>

            <div className="bento-skills">
              <span className="bento-tag">AWS EC2 &amp; RDS</span>
              <span className="bento-tag">Docker Compose</span>
              <span className="bento-tag">Jenkins CI/CD</span>
              <span className="bento-tag">Linux SysAdmin</span>
              <span className="bento-tag">VPC Networking</span>
              <span className="bento-tag">Nginx Routing</span>
            </div>
          </div>

          {/* Bento Card 2 */}
          <div className="bento-card">
            <div className="bento-header flex justify-between items-start mb-4">
              <div className="bento-number">02</div>
              <div className="bento-category">Backend &amp; Security Engineering</div>
            </div>

            <div className="bento-visual my-4 flex items-center justify-center text-emerald-400">
              <Server className="w-12 h-12 stroke-[1.5]" />
            </div>

            <p className="bento-desc">
              Building secure, performant RESTful APIs with Laravel (PHP) and Node.js. Architecting
              normalized relational database schemas across MySQL, MariaDB, and PostgreSQL with
              strict authentication, rate limiting, and defense against OWASP vulnerabilities.
            </p>

            <div className="bento-skills">
              <span className="bento-tag">Laravel &amp; PHP</span>
              <span className="bento-tag">Node.js REST APIs</span>
              <span className="bento-tag">MySQL &amp; PostgreSQL</span>
              <span className="bento-tag">Redis Caching</span>
              <span className="bento-tag">OWASP Defense</span>
              <span className="bento-tag">CTF Cybersecurity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
