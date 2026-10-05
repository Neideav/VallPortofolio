"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Zap, Shield, Sparkles } from "lucide-react";
import { achievements, Achievement } from "@/data/achievements";

export function Achievements() {
  return (
    <section id="achievements" className="py-20 sm:py-28 px-4 sm:px-6 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col mb-12 sm:mb-16">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 tracking-widest uppercase mb-2">
            <span>07</span>
            <span className="text-slate-600">/</span>
            <span>IMPACT &amp; RECOGNITION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Key Achievements
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
            Tangible benchmarks of technical rigor, competition performance, and certified engineering standards.
          </p>
        </div>

        {/* Large Number + Statement Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item: Achievement, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#0e121d] to-[#090b12] border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80 group-hover:scale-125 transition-transform" />
                </div>

                {/* Big Metric Display */}
                <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-emerald-400 mb-3 group-hover:text-emerald-300 transition-colors">
                  {item.metric}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 leading-snug">
                  {item.title}
                </h3>
                <div className="font-mono text-xs text-emerald-400/80 mb-3">
                  {item.subtitle}
                </div>
              </div>

              {/* Detail */}
              <p className="text-xs text-slate-400 leading-relaxed pt-3 border-t border-white/[0.05]">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
