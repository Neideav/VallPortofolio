export interface AwardItem {
  id: string;
  title: string;
  link: string;
  icon: "cap" | "trophy" | "shield" | "languages";
}

export interface AwardPhoto {
  id: string;
  src: string;
  alt: string;
  badge: string;
  orientation: "vertical" | "landscape";
}

export const defaultAwardsList: AwardItem[] = [
  {
    id: "deans-lister",
    title: "Dean's Lister",
    link: "https://github.com/Neideav",
    icon: "cap",
  },
  {
    id: "jhic-top30",
    title: "Top 30 Nasional — Jagoan Hosting Infra Competition",
    link: "https://drive.google.com/file/d/1h10-ihrs3HlE0CYKEYV1HAmIz0HE3F2B/view?usp=sharing",
    icon: "trophy",
  },
  {
    id: "confluent-certified",
    title: "Confluent Certified Data Streaming Engineer",
    link: "https://certificates.confluent.io/ca9e0ec3-3477-4e96-a728-6b7a780215f5#acc.6g2t0FeD",
    icon: "shield",
  },
  {
    id: "efset-english",
    title: "EF SET English Certificate — C2 Proficient (91/100)",
    link: "https://cert.efset.org/vukNhe",
    icon: "languages",
  },
  {
    id: "hacktiv8-ai-productivity",
    title: "AI Productivity & AI API Integration — Hacktiv8",
    link: "https://certificate-and-transcript.s3.ap-southeast-1.amazonaws.com/documents/8b859741-ab44-4af6-bd27-e583ad965899/1790742859761-19281362-efe5-4360-95e8-a6f6713a0076.pdf",
    icon: "shield",
  },
];

export const defaultPhotoColumns: AwardPhoto[][] = [
  // Column 1: Vertical then Landscape
  [
    {
      id: "award-solo",
      src: "/images/awards/photo-award-solo.jpg",
      alt: "Academic and Competition Awardee",
      badge: "Competition Winner",
      orientation: "vertical",
    },
    {
      id: "grad-friends",
      src: "/images/awards/photo-grad-friends.jpg",
      alt: "Bachelor of Informatics Graduation with Colleagues",
      badge: "Bachelor with Honors",
      orientation: "landscape",
    },
  ],
  // Column 2: Landscape then Vertical
  [
    {
      id: "booth-showcase",
      src: "/images/awards/photo-booth.jpg",
      alt: "Project Showcase & Kiosk Exhibition",
      badge: "Project Showcase",
      orientation: "landscape",
    },
    {
      id: "grad-selfie",
      src: "/images/awards/photo-grad-selfie.jpg",
      alt: "Graduation Day Celebration",
      badge: "Academic Honors",
      orientation: "vertical",
    },
  ],
  // Column 3: Vertical then Landscape
  [
    {
      id: "grad-family",
      src: "/images/awards/photo-grad-family.jpg",
      alt: "Graduation Day with Family",
      badge: "Family & Honors",
      orientation: "vertical",
    },
    {
      id: "stage-ceremony",
      src: "/images/awards/photo-stage.jpg",
      alt: "National Award Stage Ceremony",
      badge: "National Stage",
      orientation: "landscape",
    },
  ],
  // Column 4: Landscape then Vertical
  [
    {
      id: "jhic-team",
      src: "/images/awards/photo-jhic-team.jpg",
      alt: "Top 30 Nasional Jagoan Hosting Infra Competition Team",
      badge: "Top 30 Nasional // JHIC",
      orientation: "landscape",
    },
    {
      id: "jhic-participants",
      src: "/images/awards/photo-jhic-participants.jpg",
      alt: "Competition Finalists ID Circle",
      badge: "Finalist Circle",
      orientation: "vertical",
    },
  ],
];
