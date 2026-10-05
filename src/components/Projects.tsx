"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ArrowUpRight,
  Terminal,
  Cpu,
  Layers,
  Shield,
  Activity,
  ChevronRight,
} from "lucide-react";
import { GithubIcon } from "./Icons";
import { projects, Project } from "@/data/projects";
import { ProjectModal } from "./ProjectModal";

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Visual schematic generator for project cards
  const renderCardSchematic = (project: Project) => {
    switch (project.id) {
      case "shopcart":
        return (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-black/80 border border-white/[0.06] p-4 flex flex-col justify-between font-mono text-[11px] overflow-hidden group-hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between text-slate-400 border-b border-white/[0.06] pb-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                aws_topology.tf
              </span>
              <span className="text-[10px] text-emerald-400/80 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                VPC // RDS
              </span>
            </div>
            <div className="space-y-1 text-slate-400 text-[10px] py-2">
              <div className="text-slate-300">
                <span className="text-emerald-400">&gt;</span> provision_stack: <span className="text-amber-300">&quot;AWS EC2 + RDS MySQL&quot;</span>
              </div>
              <div>
                <span className="text-emerald-400">&gt;</span> container_runtime: <span className="text-cyan-300">&quot;Docker Compose&quot;</span>
              </div>
              <div>
                <span className="text-emerald-400">&gt;</span> reverse_proxy: <span className="text-slate-300">&quot;Nginx SSL Gateway&quot;</span>
              </div>
              <div className="text-emerald-400/90 flex items-center gap-1 mt-1">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>status: 200 OK | cache: redis_hit</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[9px] text-slate-400">
              <span>LATENCY: 118ms</span>
              <span className="text-emerald-400 font-semibold">HEALTHY</span>
            </div>
          </div>
        );

      case "ctf-platform":
        return (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-cyan-950/20 via-slate-900/60 to-black/80 border border-white/[0.06] p-4 flex flex-col justify-between font-mono text-[11px] overflow-hidden group-hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center justify-between text-slate-400 border-b border-white/[0.06] pb-2">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Shield className="w-3.5 h-3.5" />
                ctf_sandbox_daemon.sh
              </span>
              <span className="text-[10px] text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                SANDBOX ISOLATION
              </span>
            </div>
            <div className="space-y-1 text-slate-400 text-[10px] py-2">
              <div className="text-slate-300">
                <span className="text-cyan-400">&gt;</span> spawn_challenge: <span className="text-amber-300">&quot;web_exploit_04&quot;</span>
              </div>
              <div>
                <span className="text-cyan-400">&gt;</span> bridge_network: <span className="text-emerald-300">&quot;isolated_br0&quot;</span>
              </div>
              <div>
                <span className="text-cyan-400">&gt;</span> flag_crypto: <span className="text-slate-300">&quot;sha256_dynamic_token&quot;</span>
              </div>
              <div className="text-cyan-400/90 flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>firewall: DROP_ALL_EXTERNAL</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[9px] text-slate-400">
              <span>CONTAINERS: ACTIVE</span>
              <span className="text-cyan-400 font-semibold">SECURE</span>
            </div>
          </div>
        );

      case "cloud-infrastructure":
        return (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-blue-950/20 via-slate-900/60 to-black/80 border border-white/[0.06] p-4 flex flex-col justify-between font-mono text-[11px] overflow-hidden group-hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between text-slate-400 border-b border-white/[0.06] pb-2">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Cpu className="w-3.5 h-3.5" />
                Jenkinsfile_pipeline
              </span>
              <span className="text-[10px] text-blue-400/80 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/20">
                CI/CD AUTOMATION
              </span>
            </div>
            <div className="space-y-1 text-slate-400 text-[10px] py-2">
              <div className="text-slate-300">
                <span className="text-blue-400">&gt;</span> stage(&apos;Build&apos;): <span className="text-emerald-300">SUCCESS</span>
              </div>
              <div>
                <span className="text-blue-400">&gt;</span> stage(&apos;Test &amp; Scan&apos;): <span className="text-emerald-300">0 Vulnerabilities</span>
              </div>
              <div>
                <span className="text-blue-400">&gt;</span> stage(&apos;Deploy&apos;): <span className="text-amber-300">&quot;Nginx Zero-Downtime&quot;</span>
              </div>
              <div className="text-blue-400/90 flex items-center gap-1 mt-1">
                <Layers className="w-3 h-3 text-blue-400" />
                <span>healthcheck: pass (3/3 instances)</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[9px] text-slate-400">
              <span>TARGET UPTIME: 99.9%</span>
              <span className="text-blue-400 font-semibold">DEPLOYED</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-44 rounded-xl bg-gradient-to-br from-teal-950/20 via-slate-900/60 to-black/80 border border-white/[0.06] p-4 flex flex-col justify-between font-mono text-[11px] overflow-hidden group-hover:border-teal-500/30 transition-colors">
            <div className="flex items-center justify-between text-slate-400 border-b border-white/[0.06] pb-2">
              <span className="flex items-center gap-1.5 text-teal-400">
                <Activity className="w-3.5 h-3.5" />
                gateway_proxy.conf
              </span>
              <span className="text-[10px] text-teal-400/80 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/20">
                EDGE ROUTER
              </span>
            </div>
            <div className="space-y-1 text-slate-400 text-[10px] py-2">
              <div className="text-slate-300">
                <span className="text-teal-400">&gt;</span> rate_limiter: <span className="text-emerald-300">&quot;Redis Token Bucket&quot;</span>
              </div>
              <div>
                <span className="text-teal-400">&gt;</span> auth_verification: <span className="text-cyan-300">&quot;JWT Boundary Offload&quot;</span>
              </div>
              <div>
                <span className="text-teal-400">&gt;</span> logging: <span className="text-slate-300">&quot;JSON Structured Stream&quot;</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[9px] text-slate-400">
              <span>ROUTING: &lt;15ms</span>
              <span className="text-teal-400 font-semibold">ACTIVE</span>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="projects" className="py-20 sm:py-28 px-4 sm:px-6 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-12 sm:mb-16">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2">
            <span>04</span>
            <span className="text-slate-600">/</span>
            <span>PROJECTS</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                Selected Projects
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
                Real-world systems, containerized cloud environments, and backend architectures built with
                a focus on security and high availability.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500">
              CLICK CARD FOR SYSTEM ARCHITECTURE
            </span>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project: Project, index: number) => {
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-2xl bg-[#0c0f18]/90 border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#101420] transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div>
                  {/* Schematic / Diagram Preview Area */}
                  <div className="mb-5 transition-transform duration-300 group-hover:scale-[1.01]">
                    {renderCardSchematic(project)}
                  </div>

                  {/* Number & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-emerald-400/90 tracking-wider">
                      PROJECT {project.number}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between mb-2">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                    {project.description}
                  </p>
                </div>

                {/* Footer: Tech Stack & Links */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.03] text-slate-300 border border-white/[0.06] group-hover:border-emerald-500/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-mono text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Architecture Spec</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                          aria-label={`Live Demo for ${project.title}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                        aria-label={`GitHub repo for ${project.title}`}
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Deep-dive Architecture Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
