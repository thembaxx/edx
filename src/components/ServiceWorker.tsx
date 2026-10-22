"use client";
import { useEffect } from "react";
export default function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    const onLoad = () => { void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => { /* PWA is optional */ }); };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
