import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "edx — School, together",
        short_name: "edx",
        description: "A calmer home for school updates, messages and important dates.",
        start_url: "/",
        scope: "/",
        id: "/",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone"],
        orientation: "any",
        background_color: "#f6f7fc",
        theme_color: "#e5f2ff",
        categories: ["education", "productivity"],
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        cleanupOutdatedCaches: true,
        runtimeCaching: [],
      },
    }),
  ],
  build: {
    target: "es2022",
    cssCodeSplit: true,
  },
});
