export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  metrics?: { label: string; value: string }[];
  architecturePoints?: string[];
  bannerGradient: string;
  imageUrl?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: "fintrack-pro",
    number: "01",
    title: "FinTrack Pro",
    category: "Full-Stack Web App & Finance Analytics",
    description: "Aplikasi web manajemen keuangan terpadu dan multi-user dengan analitik arus kas, target tabungan, dan audit trail.",
    detailedDescription: "Aplikasi web manajemen finansial komprehensif yang dirancang untuk pelacakan transaksi multi-user, visualisasi chart arus kas real-time, manajemen anggaran bulanan, dan keamanan autentikasi JWT dengan enkripsi data.",
    technologies: ["React.js", "Express.js", "Tailwind CSS", "MySQL", "JWT Auth", "Recharts"],
    githubUrl: "https://github.com/Neideav/fintrack-pro",
    liveUrl: "https://fintrack-pro-topaz.vercel.app",
    featured: true,
    imageUrl: "/images/projects/fintrack-pro.png",
    image: "/images/projects/fintrack-pro.png",
    metrics: [
      { label: "Architecture", value: "REST API + SPA" },
      { label: "Deployment", value: "Vercel + Cloud DB" },
      { label: "Security", value: "JWT + Bcrypt" }
    ],
    architecturePoints: [
      "Modular backend API handling multi-tenant transactional financial records",
      "Interactive data visualization with Recharts for monthly cashflow insights",
      "Secure token-based authentication with bcrypt password hashing",
      "Responsive UI styled with Tailwind CSS optimized across all viewports"
    ],
    bannerGradient: "from-emerald-950/40 via-slate-900/60 to-zinc-950/80"
  },
  {
    id: "shopcart",
    number: "02",
    title: "Shopcart",
    category: "Full-Stack & E-Commerce Platform",
    description: "Aplikasi storefront e-commerce modern dengan product discovery dinamis, keranjang belanja real-time, dan filter kategori.",
    detailedDescription: "Platform e-commerce modern yang dibangun dengan arsitektur berbasis komponen TypeScript/React, dilengkapi katalog produk interaktif, keranjang belanja terotomasi, dan filter pencarian instan.",
    technologies: ["TypeScript", "React", "Tailwind CSS", "Vite", "REST API"],
    githubUrl: "https://github.com/Neideav/shopcart",
    liveUrl: "https://github.com/Neideav/shopcart",
    featured: true,
    imageUrl: "/images/projects/shopcart.png",
    image: "/images/projects/shopcart.png",
    metrics: [
      { label: "Language", value: "TypeScript" },
      { label: "Frontend", value: "React + Vite" },
      { label: "State", value: "Reactive Store" }
    ],
    architecturePoints: [
      "Modular shopping cart state management with real-time price computations",
      "Responsive grid product catalog with instant search and category filtering",
      "Modern clean aesthetic with warm ivory, dark forest emerald, and glass accents",
      "Optimized performance and snappy dynamic filtering across broad item lists"
    ],
    bannerGradient: "from-amber-950/40 via-stone-900/60 to-zinc-950/80"
  },
  {
    id: "kumo-ai",
    number: "03",
    title: "Kumo AI",
    category: "AI Workspace & Real-Time Intelligence",
    description: "Ruang kerja AI generasi baru dengan streaming Server-Sent Events (SSE), antarmuka minimalis modern, dan analisis konsep.",
    detailedDescription: "Ruang kerja AI generasi baru dengan streaming Server-Sent Events (SSE) berkecepatan tinggi, antarmuka minimalis modern, eksplorasi ide kreatif, analisis konsep, dan debugging kode multi-model.",
    technologies: ["React 18", "Vite", "Tailwind CSS", "SSE Streaming", "AI Intelligence", "FastAPI"],
    githubUrl: "https://github.com/Neideav/KumoAI",
    liveUrl: "https://github.com/Neideav/KumoAI",
    featured: true,
    imageUrl: "/images/projects/kumo-ai.png",
    image: "/images/projects/kumo-ai.png",
    metrics: [
      { label: "Streaming", value: "SSE Protocol" },
      { label: "Interface", value: "Minimalist Modern" },
      { label: "Interaction", value: "Real-Time Streaming" }
    ],
    architecturePoints: [
      "Natural language conversational interface with streaming token output",
      "Modular service layers connecting to modern intelligent AI endpoints",
      "Error resilient request handling and automated reconnection logic",
      "Sleek dark-mode aesthetic with accessible conversation history"
    ],
    bannerGradient: "from-cyan-950/40 via-slate-900/60 to-zinc-950/80"
  },
  {
    id: "project-shyeund",
    number: "04",
    title: "ProjectShyeunD",
    category: "Native Android Mobile Development",
    description: "Aplikasi mobile Android native yang dikembangkan menggunakan Kotlin dengan arsitektur modern dan clean code.",
    detailedDescription: "Aplikasi Android native yang dirancang menggunakan Kotlin dan Gradle, mengimplementasikan manajemen siklus hidup komponen modern, tata letak UI intuitif, dan pemisahan logika bisnis yang terstruktur.",
    technologies: ["Kotlin", "Android SDK", "Gradle", "Mobile Architecture", "Git"],
    githubUrl: "https://github.com/Neideav/ProjectShyeunD",
    liveUrl: "https://github.com/Neideav/ProjectShyeunD",
    featured: false,
    imageUrl: "/images/projects/cloudops.png",
    image: "/images/projects/cloudops.png",
    metrics: [
      { label: "Platform", value: "Android Native" },
      { label: "Language", value: "Kotlin" },
      { label: "Build Tool", value: "Gradle" }
    ],
    architecturePoints: [
      "Native Android architecture utilizing modern Kotlin language standards",
      "Robust lifecycle handling and memory efficient UI components",
      "Gradle dependency management and structured module separation",
      "Version controlled repository with clean git commits and documentation"
    ],
    bannerGradient: "from-teal-950/40 via-slate-900/60 to-zinc-950/80"
  },
  {
    id: "vallonation",
    number: "05",
    title: "Vallonation Cloud Replicator",
    category: "Fullstack Web and Cloud",
    description: "Aplikasi web Cloud Replicator komprehensif yang dirancang untuk monitoring dan tempat kontainer multi-user.",
    detailedDescription: "Aplikasi web Cloud Replicator komprehensif yang dirancang untuk monitoring dan tempat kontainer multi-user.",
    technologies: ["TypeScript", "Odin", "Dart", "MariaDB"],
    githubUrl: "https://github.com/Neideav/vallonation",
    liveUrl: "https://vallonation.vercel.app",
    featured: true,
    imageUrl: "/images/projects/ctf.png",
    image: "/images/projects/ctf.png",
    metrics: [
      { label: "Architecture", value: "Cloud Replicator" },
      { label: "Container", value: "Multi-tenant" },
      { label: "Database", value: "MariaDB" }
    ],
    architecturePoints: [
      "Real-time container status replication and performance metrics",
      "Multi-tenant isolation and automated deployment workflows",
      "High performance runtime communication and storage synchronization"
    ],
    bannerGradient: "from-emerald-950/40 via-slate-900/60 to-zinc-950/80"
  }
];

export const DEFAULT_PROJECT_IMAGES: Record<string, string> = {
  "fintrack-pro": "/images/projects/fintrack-pro.png",
  "shopcart": "/images/projects/shopcart.png",
  "kumo-ai": "/images/projects/kumo-ai.png",
  "project-shyeund": "/images/projects/cloudops.png",
  "vallonation": "/images/projects/ctf.png",
};

export function extractProjectCoverImage(
  proj: {
    id?: string;
    image_url?: string | null;
    imageUrl?: string | null;
    image?: string | null;
    metrics?: unknown;
  } | null | undefined,
  mirrorMap?: Record<string, string>
): string {
  if (!proj) return "/images/projects/fintrack-pro.png";

  // 1. Direct explicit image_url or imageUrl or image
  const direct = proj.image_url || proj.imageUrl || proj.image;
  if (direct && typeof direct === "string" && direct.trim().length > 0) {
    return direct.trim();
  }

  // 2. Metrics JSONB array checking __cover_image__ or cover_image
  if (Array.isArray(proj.metrics)) {
    const coverMetric = (proj.metrics as Array<{ label?: string; value?: string }>).find(
      (m) => m && (m.label === "__cover_image__" || m.label === "cover_image")
    );
    if (coverMetric?.value && typeof coverMetric.value === "string" && coverMetric.value.trim().length > 0) {
      return coverMetric.value.trim();
    }
  }

  // 3. From mirrored projectImages map (stored in personal_info.currently.project_images)
  if (proj.id && mirrorMap && mirrorMap[proj.id] && typeof mirrorMap[proj.id] === "string" && mirrorMap[proj.id].trim().length > 0) {
    return mirrorMap[proj.id].trim();
  }

  // 4. Default project image by ID
  if (proj.id && DEFAULT_PROJECT_IMAGES[proj.id]) {
    return DEFAULT_PROJECT_IMAGES[proj.id];
  }

  return "";
}

