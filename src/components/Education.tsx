"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Check } from "lucide-react";
import { educationData } from "@/data/education";

export function Education() {
  return (
    <section id="education" className="py-16 sm:py-20 px-4 sm:px-6 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2">
            <span>08</span>
            <span className="text-slate-600">/</span>
            <span>ACADEMIC FOUNDATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Education &amp; Systems Theory
          </h2>
        </div>

        {/* Compact Education Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-6 sm:p-8 rounded-2xl bg-[#0c0f18]/90 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {educationData.degreeOrProgram}
                  </h3>
                  <div className="font-mono text-xs text-slate-400">
                    {educationData.institution} · {educationData.period}
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-slate-200">Field of Focus:</strong> {educationData.fieldOfInterest}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {educationData.description}
              </p>
            </div>

            {/* Right Column: Technical Focus Checklist */}
            <div className="lg:col-span-6 lg:border-l lg:border-white/[0.08] lg:pl-8 space-y-2">
              <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2">
                Core Coursework &amp; Academic Focus:
              </div>
              <div className="space-y-1.5">
                {educationData.technicalFocus.map((focus, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs text-slate-300 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{focus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
