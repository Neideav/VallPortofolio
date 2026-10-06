export interface Education {
  institution: string;
  degreeOrProgram: string;
  period: string;
  fieldOfInterest: string;
  technicalFocus: string[];
  description: string;
}

export const educationData: Education = {
  institution: "SMKS PGRI 3 Malang",
  degreeOrProgram: "Teknik Komputer dan Jaringan",
  period: "2024 — 2027",
  fieldOfInterest: "Computer & Network Engineering, Cloud Infrastructure & Security",
  technicalFocus: [
    "Computer Networks, Subnetting & Routing (MikroTik / Cisco)",
    "Linux Server Administration & Virtualization",
    "Cloud Computing Infrastructure & Virtual Networks",
    "Information Security & Defensive Network Hardening",
    "Automation & Automated Systems Administration"
  ],
  description: "Focused academic progression emphasizing computer networks, routing switching, server-side infrastructure, cloud systems, and defensive cybersecurity methodologies."
};
