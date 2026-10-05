export interface Achievement {
  id: string;
  metric: string;
  prefix?: string;
  suffix?: string;
  title: string;
  subtitle: string;
  detail: string;
  tag: string;
}

export const achievements: Achievement[] = [
  {
    id: "ctf-finalist",
    metric: "01",
    title: "National Competition Finalist",
    subtitle: "Cybersecurity & CTF Defense",
    detail: "Qualified as a national finalist in competitive Capture the Flag events, solving complex challenges across web exploitation, cryptography, and server penetration.",
    tag: "Security Competitions"
  },
  {
    id: "ibm-certs",
    metric: "Multiple",
    title: "IBM Professional Certifications",
    subtitle: "Cloud & DevOps Methodologies",
    detail: "Successfully earned verified credentials in Cloud Computing architectures and DevOps engineering workflows from IBM.",
    tag: "Verified Credentials"
  },
  {
    id: "cloud-deployments",
    metric: "100%",
    title: "Automated Deployment Workflows",
    subtitle: "Containerized CI/CD Delivery",
    detail: "Built automated delivery workflows with Jenkins, Docker Compose, and Nginx reverse proxy configurations achieving reproducible, zero-downtime releases.",
    tag: "DevOps & Cloud"
  },
  {
    id: "target-uptime",
    metric: "99.9%",
    title: "Target Service Reliability",
    subtitle: "Engineered for High Availability",
    detail: "Architected systems with automated service health monitoring, resilient database failover strategies, and process recovery watchdogs.",
    tag: "Infrastructure"
  }
];
