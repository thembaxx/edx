import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Kinlo — School, together",
    short_name: "Kinlo",
    description: "A calmer home for school updates, messages and important dates.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f5f7f6",
    theme_color: "#f5f7f6",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
