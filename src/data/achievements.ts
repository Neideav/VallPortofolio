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
    id: "jhic-top30",
    metric: "Top 30",
    title: "National Infrastructure Competition",
    subtitle: "Jagoan Hosting Infra Competition (JHIC) 2025",
    detail: "Awarded Top 30 National out of participants nationwide in deploying high-performance server infrastructure, cloud networking, and resilient Linux server management.",
    tag: "National Competition"
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
