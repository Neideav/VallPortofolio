export interface ExperienceItem {
  year: string;
  period?: string;
  role: string;
  category: string;
  description: string;
  highlights: string[];
  skills: string[];
}

export const experiences: ExperienceItem[] = [
  {
    year: "2026",
    period: "2026 — Present",
    role: "Cloud & DevOps Development",
    category: "Infrastructure & CI/CD",
    description: "Focusing on designing and implementing cloud infrastructure architectures, automated deployment workflows, container orchestration with Docker, and continuous integration delivery systems.",
    highlights: [
      "Configuring AWS services including EC2 compute instances, RDS database clusters, and secure VPC networks",
      "Building Jenkins and GitHub Actions pipelines for automated test execution and container builds",
      "Administering Linux servers, setting up Nginx reverse proxies, and establishing systemd service health monitors"
    ],
    skills: ["AWS", "Docker", "Jenkins", "CI/CD", "Linux Administration", "Nginx"]
  },
  {
    year: "2026",
    period: "2026",
    role: "Cybersecurity Competitions",
    category: "CTF & Defensive Security",
    description: "Participating in competitive Capture the Flag (CTF) events and cybersecurity challenges involving hands-on vulnerability assessments, system inspection, and defensive hardening.",
    highlights: [
      "Analyzing web applications for common OWASP vulnerabilities, token flaws, and injection vectors",
      "Deploying sandbox container environments for isolated challenge reproduction and testing",
      "Engaging in rapid problem-solving, Linux privilege auditing, and encrypted payload verification"
    ],
    skills: ["Cybersecurity", "CTF Challenges", "Linux Hardening", "OWASP", "Vulnerability Analysis"]
  },
  {
    year: "2025",
    period: "2025 — 2026",
    role: "Backend Development",
    category: "APIs & System Architecture",
    description: "Developing robust server-side applications, designing normalized relational database schemas, and engineering secure RESTful APIs with authentication and validation layers.",
    highlights: [
      "Building modular backend services using Laravel (PHP) and Node.js with clear separation of concerns",
      "Designing and tuning relational databases across MySQL, MariaDB, and PostgreSQL for transactional reliability",
      "Implementing JWT authentication, middleware authorization, request validation, and structured error responses"
    ],
    skills: ["Laravel", "PHP", "Node.js", "REST API", "MySQL", "MariaDB", "PostgreSQL"]
  }
];
