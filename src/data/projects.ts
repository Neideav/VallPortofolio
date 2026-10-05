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
}

export const projects: Project[] = [
  {
    id: "shopcart",
    number: "01",
    title: "Shopcart",
    category: "Full-Stack & Cloud Architecture",
    description: "Full-stack e-commerce application deployed on AWS with Laravel, React, Docker, and managed database infrastructure.",
    detailedDescription: "Architected a high-concurrency e-commerce platform hosted on Amazon Web Services. Employs Dockerized services orchestrated behind an Nginx reverse proxy, coupled with AWS RDS MySQL for resilient transactional data persistence, Redis session caching, and secure tokenized checkout workflows.",
    technologies: ["Laravel", "React", "Docker", "AWS", "RDS", "MySQL"],
    githubUrl: "https://github.com/Neideav/shopcart",
    liveUrl: "https://shopcart-demo.vercel.app",
    featured: true,
    metrics: [
      { label: "Deployment", value: "AWS EC2 + RDS" },
      { label: "Containerization", value: "Docker Compose" },
      { label: "Throughput", value: "<120ms Latency" }
    ],
    architecturePoints: [
      "Containerized Laravel REST API backend with Nginx web server gateway",
      "Automated database migrations and seeders on managed AWS RDS MySQL",
      "Stateless session management with Redis cache to support horizontal scaling",
      "Role-Based Access Control (RBAC) protecting administrative order operations"
    ],
    bannerGradient: "from-emerald-950/40 via-slate-900/60 to-zinc-950/80"
  },
  {
    id: "ctf-platform",
    number: "02",
    title: "CTF Training Platform",
    category: "Cybersecurity & Container Orchestration",
    description: "Cybersecurity training platform designed around isolated challenges, authentication, and launchable practice environments.",
    detailedDescription: "A specialized Capture the Flag (CTF) training infrastructure built to give cybersecurity enthusiasts sandbox environments for ethical hacking. Uses dynamic Docker containers provisioned on demand with isolated network bridges, rate-limited flag submission validation, and real-time scoreboard metrics.",
    technologies: ["Next.js", "TypeScript", "Docker", "Linux", "Cybersecurity"],
    githubUrl: "https://github.com/Neideav/ctf-platform",
    liveUrl: "https://ctf-challenge.vercel.app",
    featured: true,
    metrics: [
      { label: "Isolation", value: "Dedicated Sandbox" },
      { label: "Security", value: "Hardened Linux" },
      { label: "Scoring Engine", value: "Real-time SSE" }
    ],
    architecturePoints: [
      "On-demand Docker container provisioning with strict memory and CPU quotas",
      "Network isolation via private Docker bridge networks preventing host traversal",
      "Cryptographically verified flag tokens with automated dynamic rotation",
      "Real-time event logging and anti-brute-force rate limiting"
    ],
    bannerGradient: "from-cyan-950/40 via-slate-900/60 to-zinc-950/80"
  },
  {
    id: "cloud-infrastructure",
    number: "03",
    title: "Cloud Deployment Infrastructure",
    category: "DevOps & Cloud Automation",
    description: "A cloud deployment environment focused on containerized applications, reverse proxying, infrastructure configuration, and automated delivery.",
    detailedDescription: "Engineered an end-to-end cloud provisioning pipeline utilizing automated Jenkins CI/CD jobs, Docker container pipelines, and custom Nginx reverse proxy routing. Configured VPC network subnets, automated SSL certificate renewal, and central systemd service watchdog scripts.",
    technologies: ["AWS", "Docker", "Linux", "CI/CD", "Jenkins"],
    githubUrl: "https://github.com/Neideav/cloud-deployment-infra",
    liveUrl: "https://github.com/Neideav/cloud-deployment-infra",
    featured: true,
    metrics: [
      { label: "CI/CD Pipeline", value: "Jenkins + Webhooks" },
      { label: "Uptime Target", value: "99.9% Monitored" },
      { label: "Rollback Time", value: "<30s Zero-Downtime" }
    ],
    architecturePoints: [
      "Automated Jenkins pipeline pulling main branch triggers and building images",
      "Nginx reverse proxy with SSL termination and dynamic upstream health checks",
      "Linux systemd watchdogs ensuring background daemon uptime and automatic restarts",
      "Centralized log aggregation and disk space alerting via bash telemetry scripts"
    ],
    bannerGradient: "from-blue-950/40 via-slate-900/60 to-zinc-950/80"
  },
  {
    id: "api-gateway",
    number: "04",
    title: "Resilient Microservices Gateway",
    category: "Backend & Systems Architecture",
    description: "Distributed reverse proxy and API gateway with token rate-limiting, centralized authentication, and telemetry.",
    detailedDescription: "Constructed an edge API gateway coordinating upstream microservices, routing traffic based on path rules, validating JWT tokens at the boundary, and enforcing IP token-bucket rate limits before requests hit backend worker nodes.",
    technologies: ["Node.js", "Docker", "Nginx", "Redis", "PostgreSQL"],
    githubUrl: "https://github.com/Neideav/api-gateway-service",
    liveUrl: "https://github.com/Neideav/api-gateway-service",
    featured: false,
    metrics: [
      { label: "Routing Latency", value: "<15ms" },
      { label: "Rate Limiting", value: "Token Bucket" },
      { label: "Protocol", value: "HTTP/2 + TLS" }
    ],
    architecturePoints: [
      "Token bucket rate limiting backed by distributed Redis in-memory storage",
      "Centralized JWT verification offloading authentication overhead from upstream services",
      "Unified error handling, correlation request-ID tracking, and structured JSON logs",
      "Automated Docker container health checks and zero-downtime rolling upgrades"
    ],
    bannerGradient: "from-teal-950/40 via-slate-900/60 to-zinc-950/80"
  }
];
