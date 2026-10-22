import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Mono, Mulish } from "next/font/google";
import "../src/styles.css";

const mulish = Mulish({ subsets: ["latin"], variable: "--font-mulish", display: "swap" });
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Kinlo",
  title: {
    default: "Kinlo — School, together",
    template: "%s | Kinlo",
  },
  description:
    "Kinlo brings South African schools and families together. Keep track of school updates, homework, calendars and conversations in one calm place.",
  openGraph: {
    title: "Kinlo — School, together",
    description: "A calmer, friendlier connection between schools and home.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kinlo — School, together" }],
    type: "website",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinlo — School, together",
    description: "A calmer, friendlier connection between schools and home.",
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kinlo",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#12201c" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-ZA" className={`${mulish.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
