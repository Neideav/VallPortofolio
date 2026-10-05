import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f1115",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nauval-portfolio.vercel.app"),
  title: "NAUVAL PORTFOLIO — Cloud Engineer, Backend Developer & DevOps Engineer",
  description:
    "Portfolio of Muhammad Bahruddin Nauvaldy Maulana, a developer focused on cloud infrastructure, backend development, DevOps, automation, and modern web technologies.",
  keywords: [
    "Muhammad Bahruddin Nauvaldy Maulana",
    "Nauval",
    "Cloud Engineer",
    "Backend Developer",
    "DevOps Engineer",
    "AWS",
    "Docker",
    "CI/CD",
    "Laravel",
    "Linux",
    "Portfolio"
  ],
  authors: [{ name: "Muhammad Bahruddin Nauvaldy Maulana", url: "https://github.com/Neideav" }],
  creator: "Muhammad Bahruddin Nauvaldy Maulana",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nauval-portfolio.vercel.app",
    title: "NAUVAL PORTFOLIO",
    description:
      "Specializing in Cloud Infrastructure, Backend Architecture, DevOps Automation, and Software Engineering.",
    siteName: "NAUVAL PORTFOLIO",
    images: [
      {
        url: "/images/profile.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Bahruddin Nauvaldy Maulana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NAUVAL PORTFOLIO",
    description:
      "Specializing in Cloud Infrastructure, Backend Architecture, DevOps Automation, and Software Engineering.",
    images: ["/images/profile.png"],
    creator: "@Neideav",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${greatVibes.variable} scroll-smooth dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-400">
        {children}
      </body>
    </html>
  );
}
