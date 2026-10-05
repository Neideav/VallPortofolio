"use client";

import React from "react";
import {
  Html5Logo,
  Css3Logo,
  JsLogo,
  ReactLogo,
  PythonLogo,
  FlaskLogo,
  DjangoLogo,
  PhpLogo,
  CodeIgniterLogo,
  MysqlLogo,
  MetaLogo,
  NotionLogo,
  GoogleLogo,
  TrelloLogo,
  CanvaLogo,
  FigmaLogo,
  CapCutLogo,
  BentoCodingVisual,
  BentoSupportVisual,
} from "./TechLogos";

export function WhatICanDo() {
  return (
    <section id="what-i-can-do" className="section">
      <div className="what-i-can-do-grid">
        {/* Left Side */}
        <div className="what-i-can-do-left">
          <div className="section-label">MY CAPABILITIES</div>
          <h2 className="section-title">What I Can Do</h2>
          <p className="what-i-can-do-desc">
            I combine technical, problem-solving, and digital skills to build reliable systems,
            test systems, manage data, and support efficient digital workflows.
          </p>

          {/* Tech Stack Columns matching screenshot */}
          <div className="tech-stack">
            {/* Column 1: HTML, CSS, JS, React, Python */}
            <div className="tech-stack-column">
              <div className="tech-stack-item group" title="HTML">
                <Html5Logo />
                <span className="tech-stack-label">HTML</span>
              </div>
              <div className="tech-stack-item group" title="CSS">
                <Css3Logo />
                <span className="tech-stack-label">CSS</span>
              </div>
              <div className="tech-stack-item group" title="JavaScript">
                <JsLogo />
                <span className="tech-stack-label">JavaScript</span>
              </div>
              <div className="tech-stack-item group" title="React">
                <ReactLogo />
                <span className="tech-stack-label">React</span>
              </div>
              <div className="tech-stack-item group" title="Python">
                <PythonLogo />
                <span className="tech-stack-label">Python</span>
              </div>
            </div>

            {/* Column 2: Flask, Django, PHP, CodeIgniter, MySQL */}
            <div className="tech-stack-column">
              <div className="tech-stack-item group" title="Flask">
                <FlaskLogo />
                <span className="tech-stack-label">Flask</span>
              </div>
              <div className="tech-stack-item group" title="Django">
                <DjangoLogo />
                <span className="tech-stack-label">Django</span>
              </div>
              <div className="tech-stack-item group" title="PHP">
                <PhpLogo />
                <span className="tech-stack-label">PHP</span>
              </div>
              <div className="tech-stack-item group" title="CodeIgniter">
                <CodeIgniterLogo />
                <span className="tech-stack-label">CodeIgniter</span>
              </div>
              <div className="tech-stack-item group" title="MySQL">
                <MysqlLogo />
                <span className="tech-stack-label">MySQL</span>
              </div>
            </div>

            {/* Column 3: Meta, Notion, Google, Trello, Canva */}
            <div className="tech-stack-column workspace-column">
              <div className="tech-stack-item group" title="Meta Suite">
                <MetaLogo />
                <span className="tech-stack-label">Meta Suite</span>
              </div>
              <div className="tech-stack-item group" title="Notion">
                <NotionLogo />
                <span className="tech-stack-label">Notion</span>
              </div>
              <div className="tech-stack-item group" title="Google">
                <GoogleLogo />
                <span className="tech-stack-label">Google</span>
              </div>
              <div className="tech-stack-item group" title="Trello">
                <TrelloLogo />
                <span className="tech-stack-label">Trello</span>
              </div>
              <div className="tech-stack-item group" title="Canva">
                <CanvaLogo />
                <span className="tech-stack-label">Canva</span>
              </div>
            </div>

            {/* Column 4: Figma, CapCut */}
            <div className="tech-stack-column workspace-column">
              <div className="tech-stack-item group" title="Figma">
                <FigmaLogo />
                <span className="tech-stack-label">Figma</span>
              </div>
              <div className="tech-stack-item group" title="CapCut">
                <CapCutLogo />
                <span className="tech-stack-label">CapCut</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 2 Bento Cards matching screenshot */}
        <div className="what-i-can-do-right">
          {/* Bento Card 01 */}
          <div className="bento-card bento-large">
            <div className="bento-header">
              <div className="bento-number">01</div>
              <div className="bento-category">IT, WEB DEVELOPMENT &amp; QA</div>
            </div>

            <div className="bento-visual">
              <BentoCodingVisual />
            </div>

            <p className="bento-desc">
              Building and testing functional digital systems, from database-driven web
              applications to RFID and QR-based solutions, with a focus on reliability,
              usability, and practical problem-solving.
            </p>

            <div className="bento-skills">
              <span className="bento-tag">Web Development</span>
              <span className="bento-tag">System Testing</span>
              <span className="bento-tag">Bug Identification</span>
              <span className="bento-tag">System Analysis</span>
              <span className="bento-tag">Database Management</span>
              <span className="bento-tag">MySQL</span>
              <span className="bento-tag">PHP</span>
              <span className="bento-tag">Python</span>
              <span className="bento-tag">HTML</span>
              <span className="bento-tag">CSS</span>
              <span className="bento-tag">JavaScript</span>
              <span className="bento-tag">RFID &amp; QR Integration</span>
            </div>
          </div>

          {/* Bento Card 02 */}
          <div className="bento-card bento-medium">
            <div className="bento-header">
              <div className="bento-number">02</div>
              <div className="bento-category">VA &amp; DIGITAL OPERATIONS</div>
            </div>

            <div className="bento-visual">
              <BentoSupportVisual />
            </div>

            <p className="bento-desc">
              Supporting teams with organized data, documentation, research, and digital
              workflows while helping keep day-to-day operations accurate and efficient.
            </p>

            <div className="bento-skills">
              <span className="bento-tag">Data Entry</span>
              <span className="bento-tag">Data Validation</span>
              <span className="bento-tag">Document Management</span>
              <span className="bento-tag">Online Research</span>
              <span className="bento-tag">Administrative Support</span>
              <span className="bento-tag">Google Workspace</span>
              <span className="bento-tag">Social Media Management</span>
              <span className="bento-tag">Content Optimization</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
