"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2, Cpu, Activity, ShieldCheck } from "lucide-react";
import { GithubIcon } from "./Icons";
import { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-2xl bg-[#0c0f18] border border-white/[0.12] p-6 sm:p-8 shadow-2xl shadow-black/90 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-2">
            <span>PROJECT {project.number}</span>
            <span className="text-slate-600">//</span>
            <span>{project.category}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {project.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            {project.detailedDescription || project.description}
          </p>

          {/* Performance Metrics Bar */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              {project.metrics.map((m, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    {m.label}
                  </span>
                  <span className="text-sm font-semibold text-emerald-300 font-mono mt-0.5">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Architecture Highlights */}
          {project.architecturePoints && (
            <div className="mb-6 space-y-3">
              <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                System Architecture Highlights
              </h4>
              <div className="space-y-2">
                {project.architecturePoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 p-2.5 rounded-lg bg-black/40 border border-white/[0.04]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Chips */}
          <div className="mb-8">
            <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
              Technologies Utilized
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-950/30 text-emerald-300 border border-emerald-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.08]">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs sm:text-sm transition-colors flex items-center gap-2"
              >
                <span>Live Demonstration</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-white border border-white/[0.1] text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Source Repository</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
