"use client";

import { useEffect, useRef } from "react";

type OrbProps = { size?: "hero" | "small"; interactive?: boolean; reducedMotion?: boolean };
export default function Orb({
  size = "hero",
  interactive = true,
  reducedMotion = false,
}: OrbProps) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    const element = host.current;
    if (!element || !window.WebGLRenderingContext) return;
    let active = true;
    let visible = true;
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    let resizer: ResizeObserver | undefined;
    let clean = () => {};
    void import("three")
      .then((THREE) => {
        if (!active || !element) return;
        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "low-power",
          });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        element.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 0, 7);
        const geometry = new THREE.SphereGeometry(1.32, 72, 56);
        const positions = geometry.attributes.position;
        const colors: number[] = [];
        const purple = new THREE.Color("#a549fb");
        const blue = new THREE.Color("#398eff");
        const cyan = new THREE.Color("#59e1ff");
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const base = blue.clone().lerp(purple, Math.max(0, Math.min(1, (x + y + 2.2) / 3.6)));
          base.lerp(cyan, Math.max(0, Math.min(0.72, (-y - x + 0.1) / 3.4)));
          colors.push(base.r, base.g, base.b);
        }
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        const material = new THREE.MeshPhysicalMaterial({
          vertexColors: true,
          roughness: 0.2,
          metalness: 0.08,
          clearcoat: 1,
          clearcoatRoughness: 0.11,
          envMapIntensity: 0.7,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        scene.add(new THREE.AmbientLight("#ffffff", 2.8));
        const top = new THREE.PointLight("#ffffff", 80);
        top.position.set(-3, 4, 5);
        scene.add(top);
        const violet = new THREE.PointLight("#c78fff", 55);
        violet.position.set(3, -2, 3);
        scene.add(violet);
        const pointer = { x: 0, y: 0 };
        const move = (event: PointerEvent) => {
          if (!interactive) return;
          const rect = element.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.8;
          pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.8;
        };
        const resize = () => {
          if (!active) return;
          const width = element.clientWidth;
          const height = element.clientHeight;
          if (!width || !height) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        resizer = new ResizeObserver(resize);
        resizer.observe(element);
        observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        observer.observe(element);
        element.addEventListener("pointermove", move, { passive: true });
        resize();
        const start = performance.now();
        const tick = (time: number) => {
          if (!active) return;
          if (visible && !document.hidden) {
            const seconds = (time - start) / 1000;
            mesh.rotation.y += (pointer.x + seconds * 0.1 - mesh.rotation.y) * 0.025;
            mesh.rotation.x +=
              (-pointer.y + Math.sin(seconds * 0.45) * 0.09 - mesh.rotation.x) * 0.03;
            mesh.position.y = Math.sin(seconds * 1.1) * 0.075;
            renderer.render(scene, camera);
          }
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        clean = () => {
          cancelAnimationFrame(frame);
          element.removeEventListener("pointermove", move);
          resizer?.disconnect();
          observer?.disconnect();
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
        if (!active) clean();
      })
      .catch(() => {
        /* gradient fallback handles unsupported WebGL */
      });
    return () => {
      active = false;
      clean();
    };
  }, [interactive, reducedMotion]);
  return (
    <div className={`orb-container orb-${size}`} ref={host} aria-hidden="true">
      <div className="orb-fallback" />
    </div>
  );
}
