export interface Certification {
  id: string;
  name: string;
  provider: string;
  year: string;
  category: "Confluent" | "IBM" | "Cloud" | "Cybersecurity" | "Linux & Infrastructure";
  credentialId?: string;
  verificationUrl?: string;
  status: "Verified" | "Completed" | "Active";
  summary: string;
  skillsAcquired: string[];
}

export const certifications: Certification[] = [
  {
    id: "confluent-data-streaming",
    name: "Data Streaming Engineer Foundations",
    provider: "Confluent",
    year: "2026 - 2028",
    category: "Confluent",
    credentialId: "194820484",
    verificationUrl: "https://certificates.confluent.io/ca9e0ec3-3477-4e96-a728-6b7a780215f5#acc.6g2t0FeD",
    status: "Verified",
    summary: "Industry-recognized certification from Confluent validating expertise in real-time data streaming architectures, Apache Kafka event handling, and modern distributed messaging systems.",
    skillsAcquired: ["Data Streaming", "Apache Kafka", "Event-Driven Architecture", "Distributed Messaging"]
  },
  {
    id: "ibm-cloud",
    name: "IBM Cloud Computing Fundamentals",
    provider: "IBM",
    year: "2025 - 2026",
    category: "IBM",
    credentialId: "IBM-CC-70492",
    verificationUrl: "https://www.credly.com/organizations/ibm",
    status: "Verified",
    summary: "Comprehensive grounding in cloud service models (IaaS, PaaS, SaaS), cloud native architectures, virtualization, and hybrid cloud deployment strategies.",
    skillsAcquired: ["Cloud Infrastructure", "Virtualization", "Cloud Security", "Hybrid Cloud"]
  },
  {
    id: "cloud-aws-foundations",
    name: "Cloud Architecture & Services Specialist",
    provider: "Cloud Academy / Industry Provider",
    year: "2026",
    category: "Cloud",
    credentialId: "CA-AWS-INF-2026",
    verificationUrl: "https://aws.amazon.com/certification/",
    status: "Completed",
    summary: "Hands-on competency in AWS compute (EC2), managed persistence (RDS), private networking (VPC subnets/gateways), and IAM least-privilege security.",
    skillsAcquired: ["AWS Core", "VPC Networking", "RDS Management", "IAM Policies"]
  },
  {
    id: "jhic-top30",
    name: "Top 30 Nasional — Jagoan Hosting Infra Competition (JHIC)",
    provider: "Jagoan Hosting & Maspion IT (Supported by Komdigi)",
    year: "2025",
    category: "Cloud",
    credentialId: "JHIC-2025-TOP30",
    verificationUrl: "https://drive.google.com/file/d/1h10-ihrs3HlE0CYKEYV1HAmIz0HE3F2B/view?usp=sharing",
    status: "Verified",
    summary: "Recognized as Top 30 National in the prestigious Jagoan Hosting Infra Competition (JHIC) 2025 for demonstrating excellence in cloud infrastructure engineering, server deployment, and system resilience.",
    skillsAcquired: ["Cloud Infrastructure", "Linux Server Administration", "DevOps Delivery", "High Availability"]
  },
  {
    id: "linux-admin",
    name: "Linux Infrastructure & Systems Administration",
    provider: "Open Source / Linux Professional",
    year: "2025",
    category: "Linux & Infrastructure",
    credentialId: "LNX-ADMIN-SYS-9921",
    verificationUrl: "https://github.com/Neideav",
    status: "Completed",
    summary: "Command-line mastery, bash scripting automation, systemd daemon management, firewall/iptables rules, and Nginx reverse proxy configuration.",
    skillsAcquired: ["Linux SysAdmin", "Bash Scripting", "Systemd Watchdogs", "Nginx"]
  }
];
