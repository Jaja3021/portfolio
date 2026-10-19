"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Minimal low-poly house in the site's white/green palette, built from
 * three.js primitives (no model files). three.js is loaded on demand so it
 * never blocks the hero text. Slowly turns, leans toward the pointer, and can
 * be dragged; stops animating off-screen, in background tabs, and for
 * visitors who prefer reduced motion.
 */
export function HouseScene({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    import("three").then((THREE) => {
      if (disposed) return;

      const css = (name: string, fallback: string) =>
        getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
      const palette = () => ({
        primary: css("--primary", "#1f4d3a"),
        soft: css("--primary-soft", "#e6efea"),
        surface: css("--surface", "#ffffff"),
        border: css("--border", "#e2e8e4"),
      });

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // No WebGL: the soft placeholder circle stays.
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.touchAction = "pan-y";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.position = "relative";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(7.2, 5.4, 8.2);
      camera.lookAt(0, 0.65, 0);

      scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe9e3, 1.6));
      const sun = new THREE.DirectionalLight(0xffffff, 1.9);
      sun.position.set(4, 7, 5);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.left = -4;
      sun.shadow.camera.right = 4;
      sun.shadow.camera.top = 4;
      sun.shadow.camera.bottom = -4;
      sun.shadow.radius = 4;
      scene.add(sun);

      const colors = palette();
      const mat = {
        wall: new THREE.MeshStandardMaterial({ color: colors.surface, roughness: 0.92 }),
        green: new THREE.MeshStandardMaterial({ color: colors.primary, roughness: 0.75 }),
        soft: new THREE.MeshStandardMaterial({ color: colors.soft, roughness: 1 }),
        glass: new THREE.MeshStandardMaterial({ color: colors.soft, roughness: 0.3, metalness: 0.05 }),
        path: new THREE.MeshStandardMaterial({ color: colors.border, roughness: 1 }),
        leaf: new THREE.MeshStandardMaterial({ color: colors.primary, roughness: 0.8, flatShading: true }),
      };

      const box = (w: number, h: number, d: number, m: InstanceType<typeof THREE.Material>, x: number, y: number, z: number) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
      };

      // Gable roof: a triangle extruded along the house's depth.
      const roof = (width: number, height: number, depth: number) => {
        const shape = new THREE.Shape();
        shape.moveTo(-width / 2, 0);
        shape.lineTo(width / 2, 0);
        shape.lineTo(0, height);
        shape.closePath();
        const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
        geo.translate(0, 0, -depth / 2);
        const mesh = new THREE.Mesh(geo, mat.green);
        mesh.castShadow = true;
        return mesh;
      };

      const tree = (x: number, z: number, s: number) => {
        const t = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * s, 0.07 * s, 0.35 * s, 8), mat.path);
        trunk.position.y = 0.175 * s;
        const crown = new THREE.Mesh(new THREE.ConeGeometry(0.32 * s, 0.85 * s, 7), mat.leaf);
        crown.position.y = 0.75 * s;
        crown.castShadow = trunk.castShadow = true;
        t.add(trunk, crown);
        t.position.set(x, 0.06, z);
        return t;
      };

      const world = new THREE.Group();
      const ground = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 0.12, 72), mat.soft);
      ground.receiveShadow = true;
      world.add(ground);

      const house = new THREE.Group();
      house.add(box(2.1, 1.25, 1.5, mat.wall, 0, 0.685, 0));
      const mainRoof = roof(2.45, 0.85, 1.75);
      mainRoof.position.y = 1.3;
      house.add(mainRoof);
      house.add(box(0.18, 0.45, 0.18, mat.green, 0.55, 1.85, -0.25)); // chimney
      house.add(box(0.36, 0.66, 0.04, mat.green, 0, 0.39, 0.76)); // door
      house.add(box(0.42, 0.34, 0.04, mat.glass, -0.62, 0.78, 0.76));
      house.add(box(0.42, 0.34, 0.04, mat.glass, 0.62, 0.78, 0.76));
      house.add(box(0.04, 0.34, 0.5, mat.glass, 1.07, 0.78, 0));
      // Garage annex with a flat green roof.
      house.add(box(1.0, 0.85, 1.2, mat.wall, 1.55, 0.485, 0.15));
      house.add(box(1.08, 0.08, 1.28, mat.green, 1.55, 0.95, 0.15));
      house.add(box(0.7, 0.5, 0.04, mat.soft, 1.55, 0.31, 0.76));
      house.position.set(-0.3, 0, -0.2);
      world.add(house);

      world.add(box(0.36, 0.02, 1.4, mat.path, -0.3, 0.07, 1.25)); // front path
      world.add(tree(-2.05, 0.6, 1.1), tree(-1.6, -1.6, 0.9), tree(2.2, -1.2, 1.25), tree(1.9, 1.75, 0.75));
      scene.add(world);

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      resize();

      // Keep materials in step with the light/dark theme toggle.
      const themeObserver = new MutationObserver(() => {
        const c = palette();
        mat.wall.color.set(c.surface);
        mat.green.color.set(c.primary);
        mat.leaf.color.set(c.primary);
        mat.soft.color.set(c.soft);
        mat.glass.color.set(c.soft);
        mat.path.color.set(c.border);
        renderer.render(scene, camera);
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let spin = 0.6;
      let tiltX = 0;
      let tiltTarget = 0;
      let leanTarget = 0;
      let dragging = false;
      let lastX = 0;

      const onPointerMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        leanTarget = ((e.clientX - r.left) / r.width - 0.5) * 0.35;
        tiltTarget = ((e.clientY - r.top) / r.height - 0.5) * 0.12;
        if (dragging) {
          spin += (e.clientX - lastX) * 0.01;
          lastX = e.clientX;
        }
        if (reduceMotion) render();
      };
      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
      };
      const onPointerUp = () => (dragging = false);
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);

      let frame = 0;
      let visible = true;
      let last = performance.now();

      const render = () => {
        tiltX += (tiltTarget - tiltX) * 0.08;
        // Scrolling the page also turns the house.
        world.rotation.set(tiltX, spin + leanTarget + window.scrollY * 0.004, 0);
        renderer.render(scene, camera);
      };
      const loop = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!dragging) spin += dt * 0.18;
        world.position.y = Math.sin(now / 1400) * 0.05;
        render();
        frame = requestAnimationFrame(loop);
      };
      const start = () => {
        if (reduceMotion || frame || !visible || document.hidden) return;
        last = performance.now();
        frame = requestAnimationFrame(loop);
      };
      const stop = () => {
        cancelAnimationFrame(frame);
        frame = 0;
      };

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      });
      io.observe(host);
      const onVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVisibility);

      render();
      start();
      setReady(true);

      cleanup = () => {
        stop();
        io.disconnect();
        resizeObserver.disconnect();
        themeObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        host.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) obj.geometry.dispose();
        });
        Object.values(mat).forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="3D illustration of a house"
      className={`cursor-grab active:cursor-grabbing ${className || "relative"}`}
    >
      {/* Placeholder while three.js loads (and the fallback without WebGL). */}
      <div
        aria-hidden
        className={`absolute inset-[12%] rounded-full bg-primary-soft transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
