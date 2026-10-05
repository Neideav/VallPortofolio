export interface Education {
  institution: string;
  degreeOrProgram: string;
  period: string;
  fieldOfInterest: string;
  technicalFocus: string[];
  description: string;
}

export const educationData: Education = {
  institution: "Computer Science & Engineering Studies",
  degreeOrProgram: "Informatics / Software Engineering",
  period: "2022 — 2026",
  fieldOfInterest: "Cloud Infrastructure, Distributed Systems & Backend Security",
  technicalFocus: [
    "Cloud Computing & Virtualization",
    "Computer Networks & Subnet Architecture",
    "Database Management Systems & Relational Theory",
    "Software Engineering & Automated CI/CD Practices",
    "Information Security & Cryptographic Foundations"
  ],
  description: "Focused academic progression emphasizing systems-level computing, server-side design, distributed data stores, and defensive cybersecurity methodologies."
};
