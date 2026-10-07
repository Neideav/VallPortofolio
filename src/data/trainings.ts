export interface TrainingEntry {
  id: string;
  title: string;
  date: string;
  org: string;
  desc: string;
  certificateName: string;
  certificateUrl: string;
  images: string[];
}

export const defaultTrainingData: TrainingEntry[] = [
  {
    id: "cloud-devops",
    title: "Cloud & DevOps Infrastructure Engineering",
    date: "2026 — Present",
    org: "Infrastructure & CI/CD Development",
    desc: "Architected multi-container production environments deployed on AWS with Docker Compose, automated Jenkins pipelines, and Nginx reverse proxy configurations. Set up automated systemd watchdog monitors, log aggregation, and zero-downtime rolling upgrades.",
    certificateName: "IBM DevOps and Software Engineering",
    certificateUrl: "https://www.credly.com/organizations/ibm",
    images: [
      "/images/projects/cloudops.png",
      "/images/projects/shopcart.png",
      "/images/projects/ctf.png"
    ],
  },
  {
    id: "ctf-competitions",
    title: "National Cybersecurity CTF Competitions",
    date: "2026",
    org: "Competitive Cyber Defense & Ethical Hacking",
    desc: "Competed in rigorous 9-hour Capture the Flag (CTF) national competitions involving hands-on vulnerability exploitation, reverse engineering, web penetration analysis, and dynamic containerized sandbox defense.",
    certificateName: "Competition Finalist Certificate",
    certificateUrl: "https://github.com/Neideav",
    images: [
      "/images/projects/ctf.png",
      "/images/projects/cloudops.png",
      "/images/projects/shopcart.png"
    ],
  },
  {
    id: "backend-systems",
    title: "Full-Stack & Backend Systems Architecture",
    date: "2025 — 2026",
    org: "Database-Driven Applications & REST APIs",
    desc: "Developed modular server-side applications using Laravel (PHP) and Node.js. Designed normalized relational database schemas across MySQL, MariaDB, and PostgreSQL, implementing JWT authentication, RBAC authorization, and secure transaction workflows.",
    certificateName: "IBM Cloud Computing Fundamentals",
    certificateUrl: "https://www.credly.com/organizations/ibm",
    images: [
      "/images/projects/shopcart.png",
      "/images/projects/ctf.png",
      "/images/projects/cloudops.png"
    ],
  },
];
