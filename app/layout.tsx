import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../src/styles.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "edx",
  title: {
    default: "edx — School, together",
    template: "%s | edx",
  },
  description:
    "edx brings South African schools and families together. Keep track of school updates, homework, calendars and conversations in one calm place.",
  openGraph: {
    title: "edx — School, together",
    description: "A calmer, friendlier connection between schools and home.",
    images: ["/og.svg"],
    type: "website",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "edx — School, together",
    description: "A calmer, friendlier connection between schools and home.",
    images: ["/og.svg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "edx",
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
    { media: "(prefers-color-scheme: light)", color: "#e5f2ff" },
    { media: "(prefers-color-scheme: dark)", color: "#15181f" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-ZA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Mulish:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
