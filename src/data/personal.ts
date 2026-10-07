export interface PersonalInfo {
  name: string;
  nickname: string;
  title: string;
  roles: string[];
  bio: string;
  shortBio: string;
  email: string;
  placeOfBirth: string;
  gpa: string;
  education: string;
  approach: string;
  avatarUrl: string;
  github: string;
  linkedin: string;
  location: string;
  availability: string;
  status: string;
  resumeUrl: string;
  traits: string[];
  currently: {
    building: string;
    exploring: string;
    learning: string;
  };
}

export const personalInfo: PersonalInfo = {
  name: "Muhammad Bahruddin Nauvaldy Maulana",
  nickname: "Nauval",
  title: "Cloud Engineer · Backend Developer · DevOps Engineer",
  roles: [
    "Cloud Engineer",
    "Backend Developer",
    "DevOps Engineer"
  ],
  bio: "Muhammad Bahruddin Nauvaldy Maulana is a developer focused on building scalable applications, cloud infrastructure, backend systems, and reliable deployment workflows. Dedicated to security best practices, high availability, and automated CI/CD delivery.",
  shortBio: "I build reliable backend systems, cloud infrastructure, and automated delivery pipelines with a security-first mindset.",
  email: "nvaldymaulana@gmail.com",
  placeOfBirth: "Batu, Indonesia",
  gpa: "N/A",
  education: "SMKS PGRI 3 Malang",
  approach: "Saya berkomitmen untuk memberikan solusi yang efisien, mudah dikelola, dan skalabel melalui praktik terbaik rekayasa perangkat lunak dan keandalan sistem cloud (best engineering practices & high availability).",
  avatarUrl: "/images/nauval-portrait.png",
  github: "https://github.com/Neideav",
  linkedin: "https://linkedin.com/in/nvaldymaulana",
  location: "Indonesia (Available for Remote / Hybrid)",
  availability: "Open to Opportunities & Collaborations",
  status: "System Active & Deploying",
  resumeUrl: "#contact", // Smooth scroll to contact or direct resume link
  traits: [
    "Security-First Mindset",
    "Infrastructure as Code",
    "Reliable Architecture",
    "Automation Enthusiast",
    "Problem Solver"
  ],
  currently: {
    building: "Automated AWS Container Deployments",
    exploring: "Distributed Microservices & Service Mesh",
    learning: "Advanced Linux Kernel Security & K8s Orchestration"
  }
};
