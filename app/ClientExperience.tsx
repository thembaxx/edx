"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const EdxApp = dynamic(() => import("../src/App"), {
  ssr: false,
  loading: () => (
    <main className="launch-screen" aria-live="polite" aria-label="Loading edx">
      <span className="launch-symbol" aria-hidden="true" />
      <span>Making your school day a little brighter…</span>
    </main>
  ),
});

export default function ClientExperience() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    let cancelled = false;

    const register = () => {
      void navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then(async () => {
          const worker = await navigator.serviceWorker.ready;
          if (cancelled) return;
          const assets = Array.from(
            document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>(
              "script[src],link[rel=stylesheet],link[rel=preload]",
            ),
          )
            .map((element) => element instanceof HTMLScriptElement ? element.src : element.href)
            .filter((url) => url.startsWith(window.location.origin + "/_next/static/"));
          worker.active?.postMessage({ type: "PREFETCH_DEMO_SHELL", assets });
        })
        .catch(() => {
          // App remains usable when service workers are blocked.
        });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", register);
    };
  }, []);

  return <EdxApp />;
}
