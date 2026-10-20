"use client";

import React from "react";
import { Reveal } from "./Reveal";
import { FadeInTitle } from "./FadeInTitle";
import { TechSphere, TechItem } from "./TechSphere";

// Curated skill categories for the list on the left
const categorizedSkills = [
  {
    category: "Cloud & DevOps",
    skills: ["AWS", "Docker", "Linux", "CI/CD", "Nginx", "Git", "GitHub", "Azure"],
  },
  {
    category: "Backend & Systems",
    skills: ["Python", "FastAPI", "Laravel", "Node.js", "PHP", "REST APIs", "Microservices"],
  },
  {
    category: "Database & Storage",
    skills: ["PostgreSQL", "MySQL", "Redis", "MariaDB", "Query Optimization"],
  },
  {
    category: "Security & Full-Stack",
    skills: ["Cybersecurity (CTF)", "System Hardening", "TypeScript", "React", "Vue.js", "Tailwind CSS"],
  },
];

// Tech stack items for the 3D rotating sphere (Fibonacci distribution)
const sphereItems: TechItem[] = [
  { name: "AWS", icon: "/images/tech/aws.svg" },
  {
    name: "Docker",
    svg: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="#0db7ed">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m21.688 1.258c-.37-.247-.973-.346-1.637-.253-.162-.646-.576-1.2-1.165-1.56-.63-.388-1.425-.494-2.182-.294-.438.115-.84.34-1.18.653-.35-.098-.716-.148-1.085-.148H1.36c-.463 0-.84.376-.84.84 0 2.222.756 4.384 2.158 6.175 1.57 2.004 3.744 3.257 6.132 3.535 4.708.547 9.87-.696 12.607-4.223.957-1.233 1.543-2.738 1.696-4.304.043-.443-.167-.887-.585-1.164" />
      </svg>
    ),
  },
  { name: "Python", icon: "/images/tech/python.svg" },
  { name: "FastAPI", icon: "/images/tech/fastapi.svg" },
  { name: "Laravel", icon: "/images/tech/laravel.svg" },
  { name: "PostgreSQL", icon: "/images/tech/postgres.svg" },
  { name: "Redis", icon: "/images/tech/redis.svg" },
  { name: "MySQL", icon: "/images/tech/mysql.svg" },
  {
    name: "Linux",
    svg: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.002 0c-2.825 0-4.998 2.057-4.998 4.793 0 1.097.359 2.106.963 2.923C7.432 8.784 7.02 10.23 7.02 11.97c0 1.258.261 2.378.736 3.32-.476.326-1.12.87-1.572 1.577-.597.93-.84 1.942-.516 2.502.26.452.887.632 1.674.526 1.002-.135 2.155-.744 2.87-1.47 1.05.378 2.213.585 3.42.585s2.37-.207 3.42-.585c.715.726 1.868 1.335 2.87 1.47.787.106 1.414-.074 1.674-.526.324-.56.081-1.572-.516-2.502-.452-.707-1.096-1.25-1.572-1.577.475-.942.736-2.062.736-3.32 0-1.74-.412-3.186-.947-4.254.604-.817.963-1.826.963-2.923C20.002 2.057 17.829 0 15.002 0h-3z" />
      </svg>
    ),
  },
  { name: "Nginx", icon: "/images/tech/nginx.svg" },
  { name: "Node.js", icon: "/images/tech/nodejs.svg" },
  { name: "TypeScript", icon: "/images/tech/ts.svg" },
  { name: "JavaScript", icon: "/images/tech/js.svg" },
  {
    name: "React",
    svg: (
      <svg className="h-3.5 w-3.5" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "Next.js",
    svg: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 180 180" fill="currentColor">
        <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" />
        <rect height="72" width="12" x="115" y="54" />
      </svg>
    ),
  },
  { name: "Vue.js", icon: "/images/tech/vue.svg" },
  { name: "Tailwind CSS", icon: "/images/tech/tailwind.svg" },
  { name: "Git", icon: "/images/tech/git.svg" },
  { name: "GitHub", icon: "/images/tech/github.svg" },
  { name: "Azure", icon: "/images/tech/azure.svg" },
  { name: "PHP", icon: "/images/tech/php.svg" },
  {
    name: "Cybersecurity",
    svg: (
      <svg
        className="h-3.5 w-3.5 text-emerald-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

export function WhatICanDo() {
  return (
    <section
      id="skills"
      className="section min-h-screen border-t border-[var(--line)]"
    >
      <span id="what-i-can-do" className="sr-only pointer-events-none" />

      {/* Header consistent with other sections (Work, About, Awards, Trainings) */}
      <div className="mb-6 sm:mb-8">
        <Reveal delay={0}>
          <div className="section-label">MY CAPABILITIES</div>
          <FadeInTitle text="What I Can Do" />
          <p className="section-desc">
            I combine cloud architecture, backend development, and cybersecurity skills to build
            reliable systems, scalable APIs, and secure digital infrastructure.
          </p>
        </Reveal>
      </div>

      {/* Grid: Categories on Left, 3D Sphere on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Side (5 cols): Categorized Skills */}
        <div className="lg:col-span-5 flex flex-col">
          <Reveal delay={100}>
            <div className="flex flex-col divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {categorizedSkills.map((cat) => (
                <div key={cat.category} className="py-3 sm:py-3.5 first:pt-2.5 last:pb-2.5">
                  <h3 className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--muted)] mb-2">
                    {cat.category}
                  </h3>
                  <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                    {cat.skills.map((skill) => (
                      <li
                        key={skill}
                        className="inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--text)] transition-colors hover:border-emerald-500 hover:text-emerald-500"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right Side (7 cols): Interactive 3D Sphere */}
        <div className="lg:col-span-7 flex justify-center items-center">
          <Reveal delay={180} className="w-full flex justify-center">
            <TechSphere items={sphereItems} maxSize={500} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
