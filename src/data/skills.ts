export interface SkillItem {
  name: string;
  level?: string;
  badge?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  skills: SkillItem[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "cloud",
    title: "Cloud Infrastructure",
    description: "Cloud architectures designed for scalability, network isolation, and reliable availability.",
    iconName: "Cloud",
    skills: [
      { name: "AWS", level: "Advanced" },
      { name: "EC2", level: "Compute" },
      { name: "RDS", level: "Managed DB" },
      { name: "VPC", level: "Networking" },
      { name: "IAM", level: "Security / Policy" },
      { name: "S3", level: "Object Storage" },
      { name: "CloudWatch", level: "Monitoring" }
    ]
  },
  {
    id: "devops",
    title: "DevOps & CI/CD",
    description: "Automated pipelines, containerization, reverse proxying, and Linux system automation.",
    iconName: "Terminal",
    skills: [
      { name: "Docker", level: "Containerization" },
      { name: "Jenkins", level: "Pipeline Automation" },
      { name: "GitHub Actions", level: "CI/CD" },
      { name: "Git", level: "Version Control" },
      { name: "Linux", level: "Server Admin" },
      { name: "Nginx", level: "Reverse Proxy" },
      { name: "Monitoring", level: "Observability" }
    ]
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Robust server-side logic, secure RESTful APIs, and scalable application architectures.",
    iconName: "Server",
    skills: [
      { name: "Laravel", level: "Primary Framework" },
      { name: "PHP", level: "Core Language" },
      { name: "Node.js", level: "Runtime" },
      { name: "REST API", level: "API Design" },
      { name: "Express", level: "Microservices" },
      { name: "JWT / Auth", level: "Authentication" }
    ]
  },
  {
    id: "database",
    title: "Databases & Storage",
    description: "Relational data modeling, ACID compliance, query optimization, and persistent stores.",
    iconName: "Database",
    skills: [
      { name: "MySQL", level: "Relational DB" },
      { name: "MariaDB", level: "Enterprise RDBMS" },
      { name: "PostgreSQL", level: "Advanced SQL" },
      { name: "Redis", level: "Caching / Queue" }
    ]
  },
  {
    id: "security",
    title: "Security & CTF",
    description: "Vulnerability analysis, defense-in-depth, hardened system configuration, and CTF challenges.",
    iconName: "ShieldCheck",
    skills: [
      { name: "Linux Security", level: "Hardening" },
      { name: "Web Security", level: "Defensive Coding" },
      { name: "OWASP Concepts", level: "Risk Mitigation" },
      { name: "CTF / Cybersecurity", level: "Pen Testing / Defense" },
      { name: "Firewall & SSH", level: "Access Control" }
    ]
  },
  {
    id: "frontend",
    title: "Frontend Engineering",
    description: "Modern, responsive client interfaces with TypeScript, reactive states, and Tailwind CSS.",
    iconName: "Layout",
    skills: [
      { name: "React", level: "Component UI" },
      { name: "Next.js", level: "App Router" },
      { name: "TypeScript", level: "Type Safety" },
      { name: "JavaScript", level: "ES6+" },
      { name: "Tailwind CSS", level: "Design Tokens" },
      { name: "HTML5", level: "Semantic Markup" },
      { name: "CSS3", level: "Modern Layouts" }
    ]
  }
];
