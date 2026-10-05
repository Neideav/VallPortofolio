export interface Capability {
  number: string;
  category: string;
  tagline: string;
  description: string;
  iconName: string;
  technologies: string[];
  keyPractices: string[];
}

export const capabilities: Capability[] = [
  {
    number: "01",
    category: "Cloud Engineering",
    tagline: "High-Availability Infrastructure & Cloud Services",
    description: "Design, deploy, configure, and maintain cloud-based infrastructure and services with a focus on fault tolerance, automated scalability, and strict security posture.",
    iconName: "Cloud",
    technologies: ["AWS", "EC2", "RDS", "VPC", "IAM", "Docker", "Linux"],
    keyPractices: [
      "VPC Network Isolation & Subnet Segmentation",
      "IAM Least-Privilege Access Architecture",
      "Managed Database Provisioning & Auto-Backups",
      "Containerized Workload Hosting & Elastic Scaling"
    ]
  },
  {
    number: "02",
    category: "Backend Development",
    tagline: "Performant APIs & Resilient Data Architectures",
    description: "Build reliable APIs, authentication systems, database-driven applications, and backend services optimized for throughput, data integrity, and maintainability.",
    iconName: "Server",
    technologies: ["Laravel", "PHP", "Node.js", "REST API", "MySQL", "MariaDB", "PostgreSQL"],
    keyPractices: [
      "Secure Token-based & Session Authentication",
      "Relational Schema Normalization & Query Tuning",
      "Microservice Endpoints & Comprehensive Validation",
      "Layered Service Architecture & Clean Business Logic"
    ]
  },
  {
    number: "03",
    category: "DevOps Engineering",
    tagline: "Automated Pipelines & Reliable Infrastructure Workflows",
    description: "Automate application delivery, deployments, infrastructure workflows, and development pipelines to achieve zero-downtime releases and continuous observability.",
    iconName: "GitBranch",
    technologies: ["Docker", "Git", "GitHub", "Jenkins", "CI/CD", "Linux", "Nginx", "Monitoring"],
    keyPractices: [
      "Automated Multi-Stage CI/CD Deployment Pipelines",
      "Multi-Container Orchestration & Reverse Proxy Routing",
      "Linux System Administration & Service Daemonization",
      "Continuous Health Checks, Alerting & Log Telemetry"
    ]
  }
];
