"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { certifications, Certification } from "@/data/certifications";

export function Certifications() {
  return (
    <section id="certifications" className="py-20 sm:py-28 px-4 sm:px-6 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-12 sm:mb-16">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2">
            <span>06</span>
            <span className="text-slate-600">/</span>
            <span>CREDENTIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Certifications &amp; Credentials
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
            Verified technical competencies across cloud computing, software engineering, Linux system
            administration, and cybersecurity defense.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert: Certification, index: number) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-6 rounded-2xl bg-[#0c0f18]/80 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header: Provider & Year */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
                    {cert.provider}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {cert.year}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {cert.name}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {cert.summary}
                </p>

                {/* Skills Acquired */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {cert.skillsAcquired.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-slate-400 border border-white/[0.04]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Credential ID & Verification */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{cert.status}</span>
                </div>

                {cert.verificationUrl && (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
