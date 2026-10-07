"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ExternalLink, ShieldCheck, GraduationCap, Languages, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { FadeInTitle } from "./FadeInTitle";

interface AwardItem {
  id: string;
  title: string;
  link: string;
  icon: "cap" | "trophy" | "shield" | "languages";
}

interface AwardPhoto {
  id: string;
  src: string;
  alt: string;
  badge: string;
  orientation: "vertical" | "landscape";
}

const photoColumns: AwardPhoto[][] = [
  // Column 1: Vertical then Landscape
  [
    {
      id: "award-solo",
      src: "/images/awards/photo-award-solo.jpg",
      alt: "Academic and Competition Awardee",
      badge: "Competition Winner",
      orientation: "vertical",
    },
    {
      id: "grad-friends",
      src: "/images/awards/photo-grad-friends.jpg",
      alt: "Bachelor of Informatics Graduation with Colleagues",
      badge: "Bachelor with Honors",
      orientation: "landscape",
    },
  ],
  // Column 2: Landscape then Vertical
  [
    {
      id: "booth-showcase",
      src: "/images/awards/photo-booth.jpg",
      alt: "Project Showcase & Kiosk Exhibition",
      badge: "Project Showcase",
      orientation: "landscape",
    },
    {
      id: "grad-selfie",
      src: "/images/awards/photo-grad-selfie.jpg",
      alt: "Graduation Day Celebration",
      badge: "Academic Honors",
      orientation: "vertical",
    },
  ],
  // Column 3: Vertical then Landscape
  [
    {
      id: "grad-family",
      src: "/images/awards/photo-grad-family.jpg",
      alt: "Graduation Day with Family",
      badge: "Family & Honors",
      orientation: "vertical",
    },
    {
      id: "stage-ceremony",
      src: "/images/awards/photo-stage.jpg",
      alt: "National Award Stage Ceremony",
      badge: "National Stage",
      orientation: "landscape",
    },
  ],
  // Column 4: Landscape then Vertical (including newly added JHIC photos)
  [
    {
      id: "jhic-team",
      src: "/images/awards/photo-jhic-team.jpg",
      alt: "Top 30 Nasional Jagoan Hosting Infra Competition Team",
      badge: "Top 30 Nasional // JHIC",
      orientation: "landscape",
    },
    {
      id: "jhic-participants",
      src: "/images/awards/photo-jhic-participants.jpg",
      alt: "Competition Finalists ID Circle",
      badge: "Finalist Circle",
      orientation: "vertical",
    },
  ],
];

const awardsList: AwardItem[] = [
  {
    id: "deans-lister",
    title: "Dean's Lister",
    link: "https://github.com/Neideav",
    icon: "cap",
  },
  {
    id: "jhic-top30",
    title: "Top 30 Nasional — Jagoan Hosting Infra Competition",
    link: "https://drive.google.com/file/d/1h10-ihrs3HlE0CYKEYV1HAmIz0HE3F2B/view?usp=sharing",
    icon: "trophy",
  },
  {
    id: "confluent-certified",
    title: "Confluent Certified Data Streaming Engineer",
    link: "https://certificates.confluent.io/ca9e0ec3-3477-4e96-a728-6b7a780215f5#acc.6g2t0FeD",
    icon: "shield",
  },
  {
    id: "efset-english",
    title: "EF SET English Certificate — C2 Proficient (91/100)",
    link: "https://cert.efset.org/vukNhe",
    icon: "languages",
  },
  {
    id: "best-capstone",
    title: "Best Capstone System & Architecture",
    link: "https://certificate-and-transcript.s3.ap-southeast-1.amazonaws.com/documents/8b859741-ab44-4af6-bd27-e583ad965899/1790742859761-19281362-efe5-4360-95e8-a6f6713a0076.pdf",
    icon: "trophy",
  },
];

export function Awards() {
  const [selectedPhoto, setSelectedPhoto] = useState<AwardPhoto | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto]);

  const getIcon = (type: AwardItem["icon"]) => {
    switch (type) {
      case "cap":
        return <GraduationCap className="w-5 h-5 text-zinc-300" />;
      case "trophy":
        return <Trophy className="w-5 h-5 text-zinc-300" />;
      case "shield":
        return <ShieldCheck className="w-5 h-5 text-zinc-300" />;
      case "languages":
        return <Languages className="w-5 h-5 text-zinc-300" />;
    }
  };

  return (
    <section id="awards" className="section min-h-screen flex flex-col justify-center py-20">
      <div className="w-full">
        <Reveal delay={0}>
          <div className="section-label">RECOGNITION</div>
          <FadeInTitle text="Awards and Achievements" />
          <p className="section-desc mb-8 lg:mb-10">
            A collection of academic and professional recognitions that reflect my dedication to excellence.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-center">
            {/* Left Side: Photo Collage with alternating vertical and landscape photos */}
            <div className="lg:col-span-7 xl:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {photoColumns.map((col, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2.5 sm:gap-3">
                    {col.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/60 border border-white/[0.08] hover:border-white/20 bg-zinc-900 group ${
                          photo.orientation === "vertical"
                            ? "h-[200px] sm:h-[220px]"
                            : "h-[135px] sm:h-[150px]"
                        }`}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 35vw, 18vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Awards Cards List Column */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-3">
              {awardsList.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="award-card group"
                >
                  <div className="award-card-left">
                    <div className="award-card-icon">{getIcon(item.icon)}</div>
                    <div className="award-card-title">{item.title}</div>
                  </div>
                  <ExternalLink className="award-card-arrow w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close"
                className="absolute -top-12 right-0 p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative w-full max-h-[80vh] flex items-center justify-center rounded-2xl overflow-hidden border border-white/15 bg-black/50 shadow-2xl">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  width={1200}
                  height={900}
                  unoptimized
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl"
                />
              </div>
              <div className="mt-3 text-center">
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                  {selectedPhoto.badge}
                </span>
                <p className="text-xs text-zinc-400 mt-1.5">{selectedPhoto.alt}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
