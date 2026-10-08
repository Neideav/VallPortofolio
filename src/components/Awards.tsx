"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ExternalLink, ShieldCheck, GraduationCap, Languages, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { FadeInTitle } from "./FadeInTitle";

import { 
  AwardItem, 
  AwardPhoto, 
  defaultAwardsList, 
  defaultAwardPhotosList 
} from "@/data/awards";
import { fetchAwardsData } from "@/lib/awards";

export function Awards() {
  const [selectedPhoto, setSelectedPhoto] = useState<AwardPhoto | null>(null);
  const [awards, setAwards] = useState<AwardItem[]>(defaultAwardsList);
  const [photos, setPhotos] = useState<AwardPhoto[]>(defaultAwardPhotosList);

  useEffect(() => {
    try {
      const localAwards = localStorage.getItem("porto_awards_v1");
      if (localAwards) {
        const parsed = JSON.parse(localAwards);
        if (Array.isArray(parsed) && parsed.length > 0) setAwards(parsed);
      }
      const localPhotos = localStorage.getItem("porto_award_photos_v1");
      if (localPhotos) {
        const parsed = JSON.parse(localPhotos);
        if (Array.isArray(parsed) && parsed.length > 0) setPhotos(parsed);
      }
    } catch {}

    fetchAwardsData().then((data) => {
      if (data) {
        if (data.awards && data.awards.length > 0) setAwards(data.awards);
        if (data.photos && data.photos.length > 0) setPhotos(data.photos);
      }
    });
  }, []);

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
            {/* Left Side: Photo Collage (Maksimal 6 Foto dengan Format Persegi Panjang, Kotak, Portrait) */}
            <div className="lg:col-span-7 xl:col-span-7">
              <div className="columns-2 sm:columns-3 gap-3 space-y-3">
                {photos.slice(0, 6).map((photo, index) => {
                  const isLandscape = photo.orientation === "landscape";
                  const isSquare = photo.orientation === "square";
                  const aspectClass = isLandscape
                    ? "aspect-[16/10]"
                    : isSquare
                    ? "aspect-square"
                    : "aspect-[3/4]";
                  const formatBadge = isLandscape ? "Landscape" : isSquare ? "Kotak" : "Portrait";

                  return (
                    <div
                      key={photo.id || index}
                      onClick={() => setSelectedPhoto(photo)}
                      className={`relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/70 border border-white/[0.08] hover:border-white/20 bg-zinc-900 group ${aspectClass}`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 35vw, 22vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Hover overlay with badge & caption */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 pointer-events-none">
                        <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider line-clamp-1">
                          {photo.badge}
                        </span>
                        {photo.alt && (
                          <span className="text-[11px] text-zinc-300 line-clamp-1 mt-0.5">
                            {photo.alt}
                          </span>
                        )}
                      </div>
                      {/* Top badge */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-white/10">
                          {formatBadge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Awards Cards List Column */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-3">
              {awards.map((item) => (
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
