"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Terminal,
  Server,
  Database,
  ShieldCheck,
  Layout,
  Filter,
} from "lucide-react";
import { skillCategories, SkillCategory } from "@/data/skills";

export function TechStack() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Cloud":
        return <Cloud className="w-4 h-4 text-emerald-400" />;
      case "Terminal":
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case "Server":
        return <Server className="w-4 h-4 text-emerald-400" />;
      case "Database":
        return <Database className="w-4 h-4 text-emerald-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "Layout":
        return <Layout className="w-4 h-4 text-emerald-400" />;
      default:
        return <Terminal className="w-4 h-4 text-emerald-400" />;
    }
  };

  const filteredCategories =
    activeTab === "all"
      ? skillCategories
      : skillCategories.filter((c) => c.id === activeTab);

  return (
    <section id="tech-stack" className="py-20 sm:py-28 px-4 sm:px-6 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-10 sm:mb-14">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2">
            <span>03</span>
            <span className="text-slate-600">/</span>
            <span>TECH STACK</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                Technical Stack &amp; Tools
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
                Structured into dedicated operational domains—from cloud infrastructure and CI/CD pipelines
                to backend services and database optimization.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#0c0f18] border border-white/[0.08] text-xs">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                  activeTab === "all"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Domains
              </button>
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg font-mono transition-colors cursor-pointer ${
                    activeTab === cat.id
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {cat.title.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categorized Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat: SkillCategory, index: number) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="p-6 rounded-2xl bg-[#0c0f18]/80 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  {cat.description}
                </p>

                {/* Skills Pills with Levels */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="group/pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-emerald-950/20 border border-white/[0.06] hover:border-emerald-500/30 transition-all"
                    >
                      <span className="text-xs font-medium text-slate-200 group-hover/pill:text-emerald-300">
                        {skill.name}
                      </span>
                      {skill.level && (
                        <span className="font-mono text-[9px] text-slate-500 group-hover/pill:text-slate-400">
                          [{skill.level}]
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status footer inside card */}
              <div className="pt-4 mt-5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{cat.skills.length} TECHNOLOGIES</span>
                <span className="text-emerald-400/80">VERIFIED</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
