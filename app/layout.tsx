import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import ServiceWorker from "../src/components/ServiceWorker";

export const metadata: Metadata = {
  title: { default: "edx — School, together", template: "%s · edx" },
  description: "A friendlier connection between school and home. Stay informed about homework, school updates, important dates and conversations.",
  applicationName: "edx",
  appleWebApp: { capable: true, title: "edx", statusBarStyle: "default" },
  formatDetection: { telephone: false, email: false },
  icons: { icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icon-512.png", sizes: "512x512", type: "image/png" }], apple: "/apple-icon" },
  openGraph: { title: "edx — School, together", description: "A calmer connection between South African schools and families.", type: "website", images: ["/og.svg"] },
  twitter: { card: "summary_large_image", title: "edx — School, together", images: ["/og.svg"] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#e5f2ff" }, { media: "(prefers-color-scheme: dark)", color: "#15181f" }],
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en-ZA"><body><ServiceWorker />{children}</body></html>;
}
