"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Reveal } from "./Reveal";
import { FadeInTitle } from "./FadeInTitle";
import { TrainingEntry, defaultTrainingData } from "@/data/trainings";
import { fetchTrainingsData } from "@/lib/trainings";

export function Trainings() {
  const [trainings, setTrainings] = useState<TrainingEntry[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("porto_trainings_v1");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return defaultTrainingData;
  });
  const [stackIndices, setStackIndices] = useState<Record<string, number>>({
    "cloud-devops": 0,
    "ctf-competitions": 0,
    "backend-systems": 0,
  });

  useEffect(() => {
    fetchTrainingsData().then((data) => {
      if (data && data.length > 0) setTrainings(data);
    });
  }, []);

  const cycleImage = (id: string, total: number) => {
    setStackIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % total,
    }));
  };

  const getImageStyle = (imgIndex: number, currentTop: number, total: number) => {
    const diff = (imgIndex - currentTop + total) % total;
    if (diff === 0) {
      return {
        transform: "translate(0px, 0px) scale(1)",
        opacity: 1,
        zIndex: 30,
      };
    }
    if (diff === 1) {
      return {
        transform: "translate(6px, 6px) scale(0.97)",
        opacity: 0.7,
        zIndex: 20,
      };
    }
    return {
      transform: "translate(12px, 12px) scale(0.94)",
      opacity: 0.45,
      zIndex: 10,
    };
  };

  return (
    <section id="trainings" className="section border-t border-[var(--line)]">
      <Reveal delay={0}>
        <div className="section-label">Growth &amp; Experience</div>
        <FadeInTitle text="Journey and Experience" />
        <p className="section-desc">
          A collection of technical milestones, cybersecurity competitions, and engineering projects
          that shaped my technical and collaborative skills.
        </p>
      </Reveal>

      <div className="experience-list">
        {trainings.map((entry, index) => {
          const isReverse = index % 2 !== 0;
          const currentTop = stackIndices[entry.id] || 0;

          return (
            <Reveal key={entry.id} delay={100 + index * 60}>
              <div
                className={`experience-card ${isReverse ? "experience-card-reverse" : ""}`}
              >
                {/* Text Side */}
                <div className="experience-text">
                  <div className="experience-header">
                    <div className="experience-date">{entry.date}</div>
                    <h3 className="experience-title">{entry.title}</h3>
                  </div>

                  <div className="experience-org">{entry.org}</div>
                  <p className="experience-desc">{entry.desc}</p>

                  <div className="mt-3">
                    <a
                      href={entry.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="experience-certificate"
                    >
                      <span>{entry.certificateName}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5 inline" />
                    </a>
                  </div>
                </div>

                {/* Interactive Image Stack Side */}
                {(() => {
                  const imgs = entry.images && entry.images.length > 0 ? entry.images : ["/images/projects/cloudops.png"];
                  return (
                    <div
                      className="experience-image-stack group"
                      onClick={() => cycleImage(entry.id, imgs.length)}
                      title="Tap image to view next screenshot"
                    >
                      {imgs.map((imgSrc, imgIndex) => {
                        const style = getImageStyle(imgIndex, currentTop, imgs.length);
                        return (
                          <div
                            key={imgIndex}
                            className="stacked-image"
                            style={style}
                          >
                            <Image
                              src={imgSrc}
                              alt={`${entry.title} screenshot`}
                              fill
                              unoptimized
                              className="object-cover rounded-xl"
                              sizes="(max-width: 768px) 100vw, 500px"
                            />
                          </div>
                        );
                      })}

                      {/* Mobile & Desktop Tap Indicator Badge */}
                      <div className="absolute bottom-3 right-3 z-40 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/10 text-[11px] font-mono pointer-events-none">
                        <span>{currentTop + 1}/{imgs.length}</span>
                        <span className="opacity-70 text-[10px]">· Tap to flip</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
