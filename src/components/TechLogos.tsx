import React from "react";

export function Html5Logo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none">
      <path d="M71 460L30 0h452l-41 460-185 52-185-52z" fill="#E44D26" />
      <path d="M256 472l149-41 35-391H256v432z" fill="#F16529" />
      <path d="M109 176l8 88h139v-88H109zm16 177l7 79 124 35v-88l-68-19-4-47H117l8 40z" fill="#EBEBEB" />
      <path d="M256 176v88h72l-7 77-65 18v88l122-34 18-199l-8-38H256zm0-96v88h147l8-88H256zM101 80l8 88h147V80H101z" fill="#fff" />
    </svg>
  );
}

export function Css3Logo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none">
      <path d="M71 460L30 0h452l-41 460-185 52-185-52z" fill="#1572B6" />
      <path d="M256 472l149-41 35-391H256v432z" fill="#33A9DC" />
      <path d="M256 176v-88H101l8 88h147zm0 165l-68-19-4-47H117l8 79 131 36v-49z" fill="#EBEBEB" />
      <path d="M256 88v88h139l-8 88H256v88l68-19 5-54h67l-13 144-127 35v-49l139-39 16-177 8-88H256z" fill="#fff" />
    </svg>
  );
}

export function JsLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512">
      <rect width="512" height="512" rx="64" fill="#F7DF1E" />
      <path d="M165 410c0 30-18 45-47 45-25 0-41-14-49-29l29-18c6 10 13 16 20 16 11 0 16-5 16-18V265h31v145zm132-7c-13 8-31 15-53 15-39 0-66-24-66-67 0-42 27-68 69-68 20 0 35 6 45 12l-14 26c-9-6-20-10-31-10-23 0-37 15-37 40 0 24 13 39 36 39 12 0 23-4 31-10l20 23z" fill="#000" />
      <path d="M297 403c0 30-18 45-47 45-25 0-41-14-49-29l29-18c6 10 13 16 20 16 11 0 16-5 16-18V265h31v138z" fill="transparent" />
      <text x="310" y="420" fontFamily="sans-serif" fontWeight="bold" fontSize="230" fill="#000">JS</text>
    </svg>
  );
}

export function ReactLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function PythonLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 110 110">
      <path d="M54.5 5C38 5 39 12 39 12l.02 7.23H55v2.24H27.5S17 19.5 17 38.5s9.5 19 9.5 19h5.68v-8.24s-.31-9.56 9.5-9.56h16.32s9.2.14 9.2-8.86V13.8S69 5 54.5 5zm-8.82 4.67a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2z" fill="#366E9C" />
      <path d="M55.5 105c16.5 0 15.5-7 15.5-7l-.02-7.23H55v-2.24h27.5s10.5 1.97 10.5-17.03-9.5-19-9.5-19h-5.68v8.24s.31 9.56-9.5 9.56H52s-9.2-.14-9.2 8.86v17.04S41 105 55.5 105zm8.82-4.67a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2z" fill="#FFD438" />
    </svg>
  );
}

export function FlaskLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.78 17.58L14 8.19V4h1a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2h1v4.19L4.22 17.58A3.5 3.5 0 0 0 7.18 23h9.64a3.5 3.5 0 0 0 2.96-5.42zM12 10.59L16.48 18H7.52L12 10.59z" />
    </svg>
  );
}

export function DjangoLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`${className} bg-[#092E20] rounded flex items-center justify-center text-white font-serif font-bold text-xs`}>
      dj
    </div>
  );
}

export function PhpLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`${className} bg-[#777BB4] rounded-full flex items-center justify-center text-white font-bold text-[10px]`}>
      php
    </div>
  );
}

export function CodeIgniterLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#EE4623">
      <path d="M12 2C8.5 6 4 10.5 4 15.5 4 19.1 7.1 22 10.7 22c4.1 0 6.8-3.4 4.8-7.3-1.2-2.3-.3-3.6 1.4-5.3 1.9 2.1 2.9 4.3 2.9 6.6 0 3.3-2.7 6-6 6 4.4 0 8-3.6 8-8 0-4.5-5.5-9.3-9.8-12z" />
    </svg>
  );
}

export function MysqlLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#00758F">
      <path d="M21.5 12c-1.8-1.5-4.2-2.3-6.6-2.3-3.5 0-6.8 1.8-8.7 4.8-.4.6-.7 1.3-.9 2-.3.9-.4 1.9-.4 2.8 0 .4.3.7.7.7.3 0 .6-.2.7-.5.4-1.2 1.1-2.3 2.1-3.1 1.7-1.4 3.9-2.2 6.1-2.2 2.2 0 4.3.7 6 2.1.3.2.7.2.9-.1.2-.3.2-.7-.1-1-.4-.4-.8-.8-1.3-1.1zM5 8c1.5 0 2.8.8 3.5 2 .4.7 1.1 1.1 1.9 1.1s1.5-.4 1.9-1.1c.7-1.2 2-2 3.5-2 2.2 0 4 1.8 4 4 0 .6-.4 1-1 1s-1-.4-1-1c0-1.1-.9-2-2-2-.8 0-1.5.4-1.9 1.1-.7 1.2-2 2-3.5 2s-2.8-.8-3.5-2c-.4-.7-1.1-1.1-1.9-1.1s-1.5.4-1.9 1.1C2.9 11.2 2 12 1 12c-.6 0-1-.4-1-1 0-2.2 1.8-4 4-4z" />
    </svg>
  );
}

export function MetaLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0081FB">
      <path d="M12 7.2c-2.3 0-4.3 1.5-5.3 3.6-1-2.1-3-3.6-5.3-3.6-3.3 0-6 2.7-6 6s2.7 6 6 6c2.3 0 4.3-1.5 5.3-3.6 1 2.1 3 3.6 5.3 3.6 3.3 0 6-2.7 6-6s-2.7-6-6-6zm-7 8.8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm14 0c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" transform="scale(0.8) translate(3, 3)" />
    </svg>
  );
}

export function NotionLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`${className} bg-black border border-white/20 rounded flex items-center justify-center text-white font-bold text-xs`}>
      N
    </div>
  );
}

export function GoogleLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.57H1.24C.45 8.14 0 9.92 0 12s.45 3.86 1.24 5.43l4.04-3.14z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.57l4.04 3.14c.95-2.83 3.6-4.96 6.72-4.96z" />
    </svg>
  );
}

export function TrelloLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`${className} bg-[#0052CC] rounded-lg p-1.5 flex gap-1 justify-center`}>
      <div className="w-1.5 h-4 bg-white rounded-sm" />
      <div className="w-1.5 h-2.5 bg-white rounded-sm" />
    </div>
  );
}

export function CanvaLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`${className} rounded-full bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] flex items-center justify-center text-white font-bold text-xs`}>
      C
    </div>
  );
}

export function FigmaLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
    </svg>
  );
}

export function CapCutLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`${className} bg-black border border-white/20 rounded flex items-center justify-center`}>
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6l7 6-7 6V6zm9 6l7-6v12l-7-6z" />
      </svg>
    </div>
  );
}

/* Bento Visuals */
export function BentoCodingVisual() {
  return (
    <div className="w-16 h-12 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-1.5 flex flex-col justify-between shadow-md">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </div>
      <div className="flex items-center justify-center font-mono text-xs font-bold text-[var(--text)] tracking-wider">
        &lt;/&gt;
      </div>
    </div>
  );
}

export function BentoSupportVisual() {
  return (
    <div className="relative w-16 h-14 flex items-center justify-center">
      {/* Speech bubble */}
      <div className="absolute -top-1 right-1 w-5 h-4 rounded-full bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center gap-0.5">
        <div className="w-0.5 h-0.5 rounded-full bg-[var(--text)]" />
        <div className="w-0.5 h-0.5 rounded-full bg-[var(--text)]" />
        <div className="w-0.5 h-0.5 rounded-full bg-[var(--text)]" />
      </div>
      {/* Avatar with headset */}
      <div className="w-10 h-10 rounded-full border border-[var(--line)] bg-[var(--surface-2)] flex items-center justify-center relative">
        {/* Headset curve */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-emerald-400" />
        {/* Face */}
        <div className="w-5 h-5 rounded-full bg-[var(--line)] flex flex-col items-center justify-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-[var(--text)]" />
            <div className="w-1 h-1 rounded-full bg-[var(--text)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
