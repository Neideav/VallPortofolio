"use client";

import React, { useState, useEffect } from "react";
import { Mail, ExternalLink, X, Minus, CheckCircle2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";
import { Reveal } from "./Reveal";
import { personalInfo as fallbackPersonal, PersonalInfo } from "@/data/personal";
import { fetchPersonalInfo } from "@/lib/personal";

export function Contact() {
  const [personal, setPersonal] = useState<PersonalInfo>(() => {
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem("porto_personal_v1");
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && parsed.name) return parsed;
        }
      } catch {}
    }
    return fallbackPersonal;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPersonalInfo().then((data) => {
      if (data) setPersonal(data);
    });
  }, []);

  const resumeHref = (personal.resumeUrl?.trim() || fallbackPersonal.resumeUrl || "#contact");
  const isResumeExternal =
    resumeHref.startsWith("http://") ||
    resumeHref.startsWith("https://") ||
    resumeHref.endsWith(".pdf");

  const email = personal.email || fallbackPersonal.email;
  const github = personal.github || fallbackPersonal.github;
  const linkedin = personal.linkedin || fallbackPersonal.linkedin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSent(true);
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => {
          setIsSent(false);
          setModalOpen(false);
        }, 3200);
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="contact-grid">
        {/* Left Side */}
        <div className="contact-left">
          <Reveal delay={0}>
            <div className="contact-eyebrow">GET IN TOUCH</div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="contact-headline">
              LET&apos;S<br />
              <span className="contact-headline-accent text-[#10b981]">WORK</span><br />
              TOGETHER
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="contact-description">
              Looking for the next problem worth solving.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <p className="contact-secondary">
              I&apos;m open to opportunities where I can contribute to cloud engineering, backend architecture,
              DevOps automation, and high-reliability systems.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <a
              href={resumeHref}
              target={isResumeExternal ? "_blank" : undefined}
              rel={isResumeExternal ? "noopener noreferrer" : undefined}
              className="contact-resume-btn"
            >
              DOWNLOAD RESUME &rarr;
            </a>
          </Reveal>
        </div>

        {/* Right Side */}
        <div className="contact-right">
          <div className="contact-cards">
            {/* 01 EMAIL */}
            <Reveal delay={200}>
              <a
                href={`mailto:${email}`}
                className="contact-card"
              >
                <div className="contact-card-icon">
                  <Mail className="w-5 h-5 text-zinc-300" />
                </div>
                <div className="contact-card-info">
                  <div className="contact-card-label">EMAIL</div>
                  <div className="contact-card-value">{email}</div>
                </div>
                <span className="contact-card-number">01</span>
              </a>
            </Reveal>

            {/* 02 GITHUB */}
            <Reveal delay={280}>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <div className="contact-card-icon">
                  <GithubIcon className="w-5 h-5 text-zinc-300" />
                </div>
                <div className="contact-card-info">
                  <div className="contact-card-label">GITHUB</div>
                  <div className="contact-card-value">
                    {github.replace(/^https?:\/\//, "")}
                  </div>
                </div>
                <span className="contact-card-number">02</span>
                <ExternalLink className="contact-card-arrow w-4 h-4" />
              </a>
            </Reveal>

            {/* 03 LINKEDIN */}
            <Reveal delay={360}>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <div className="contact-card-icon">
                  <LinkedinIcon className="w-5 h-5 text-zinc-300" />
                </div>
                <div className="contact-card-info">
                  <div className="contact-card-label">LINKEDIN</div>
                  <div className="contact-card-value">
                    {linkedin.replace(/^https?:\/\//, "")}
                  </div>
                </div>
                <span className="contact-card-number">03</span>
                <ExternalLink className="contact-card-arrow w-4 h-4" />
              </a>
            </Reveal>
          </div>

          {/* Big CTA button */}
          <Reveal delay={440}>
            <button
              onClick={() => {
                setModalOpen(true);
                setMinimized(false);
              }}
              className="contact-cta"
            >
              SEND ME A MESSAGE &rarr;
            </button>
          </Reveal>
        </div>
      </div>

      {/* Floating Slide-up Contact Modal */}
      {modalOpen && (
        <div className={`contact-modal ${minimized ? "contact-modal--minimized" : ""}`}>
          <div
            className="contact-modal-header cursor-pointer select-none"
            onClick={() => setMinimized(!minimized)}
          >
            <div className="contact-modal-title">Transmit Dispatch // Contact Nauval</div>
            <div className="contact-modal-controls flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setMinimized(!minimized)}
                className="contact-modal-icon-btn"
                aria-label="Minimize form"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="contact-modal-icon-btn"
                aria-label="Close form"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!minimized && (
            <div className="contact-modal-inner">
              {isSent ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  <h3 className="font-bold text-lg text-[var(--text)]">Message Dispatched!</h3>
                  <p className="text-sm text-[var(--muted)]">
                    Thank you for reaching out. I will respond to your email promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-modal-form">
                  <div className="contact-modal-field">
                    <label className="contact-modal-label">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Alex Morgan"
                      className="contact-modal-input"
                    />
                  </div>

                  <div className="contact-modal-field">
                    <label className="contact-modal-label">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="alex@domain.com"
                      className="contact-modal-input"
                    />
                  </div>

                  <div className="contact-modal-field contact-modal-field--grow">
                    <label className="contact-modal-label">Your Message</label>
                    <textarea
                      rows={4}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Describe your project, cloud architecture, or collaboration inquiry..."
                      className="contact-modal-input"
                    />
                  </div>

                  {errorMessage && (
                    <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md p-2 text-center">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-modal-submit"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
