export interface Certification {
  id: string;
  name: string;
  provider: string;
  year: string;
  category: "IBM" | "Cloud" | "Cybersecurity" | "Linux & Infrastructure";
  credentialId?: string;
  verificationUrl?: string;
  status: "Verified" | "Completed" | "Active";
  summary: string;
  skillsAcquired: string[];
}

export const certifications: Certification[] = [
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
    id: "ibm-devops",
    name: "IBM DevOps and Software Engineering",
    provider: "IBM",
    year: "2025 - 2026",
    category: "IBM",
    credentialId: "IBM-DEVOPS-81239",
    verificationUrl: "https://www.credly.com/organizations/ibm",
    status: "Verified",
    summary: "In-depth training on CI/CD principles, automated testing frameworks, containerization, microservices, and Agile infrastructure delivery.",
    skillsAcquired: ["CI/CD Pipelines", "Docker", "DevOps Culture", "Agile Engineering"]
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
    id: "cybersec-defense",
    name: "Cybersecurity Defense & Vulnerability Assessment",
    provider: "National CTF & Cybersecurity Committee",
    year: "2026",
    category: "Cybersecurity",
    credentialId: "CYBER-DEF-FINALIST-2026",
    verificationUrl: "https://github.com/Neideav",
    status: "Verified",
    summary: "Practical assessment in web application exploitation defense, system vulnerability mitigation, network packet analysis, and secure code review.",
    skillsAcquired: ["OWASP Defense", "System Auditing", "Penetration Testing", "Threat Mitigation"]
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
