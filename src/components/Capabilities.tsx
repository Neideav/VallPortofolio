"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, Server, GitBranch, Check, ArrowRight } from "lucide-react";
import { capabilities, Capability } from "@/data/capabilities";

export function Capabilities() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Cloud":
        return <Cloud className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />;
      case "Server":
        return <Server className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />;
      case "GitBranch":
        return <GitBranch className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />;
      default:
        return <Cloud className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="capabilities" className="py-20 sm:py-28 px-4 sm:px-6 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-12 sm:mb-16">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2">
            <span>02</span>
            <span className="text-slate-600">/</span>
            <span>CAPABILITIES</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                What I Can Do
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
                Combining cloud infrastructure engineering, server-side development, and automated DevOps
                pipelines to build resilient production systems.
              </p>
            </div>
            <a
              href="#tech-stack"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Explore Full Tech Stack <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Major Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((item: Capability, index: number) => {
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-6 sm:p-7 rounded-2xl bg-[#0c0f18]/90 border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#111522] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top: Number & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-bold text-slate-600 group-hover:text-emerald-400/80 transition-colors">
                      {item.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] group-hover:border-emerald-500/30 group-hover:bg-emerald-950/20 flex items-center justify-center transition-all duration-300">
                      {getIcon(item.iconName)}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
                    {item.category}
                  </h3>
                  <div className="font-mono text-[11px] text-slate-400 mb-3">
                    {item.tagline}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Key architectural practices */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-white/[0.06]">
                    <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                      Key Competencies:
                    </div>
                    {item.keyPractices.map((practice, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-300"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom: Technology Pills */}
                <div>
                  <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2">
                    Core Technologies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-white/[0.04] text-slate-300 border border-white/[0.06] group-hover:border-emerald-500/20 group-hover:text-slate-200 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
