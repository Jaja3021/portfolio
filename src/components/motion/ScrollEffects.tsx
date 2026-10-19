"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide scroll triggers (see "Scroll triggers" in globals.css):
 * - [data-reveal] elements animate in once they enter the viewport
 *   (data-inview is set; CSS does the motion).
 * - [data-parallax] elements get --p (-1…1, position relative to the
 *   viewport centre) on scroll for gentle parallax.
 *
 * Content is never hidden until this has run: the hidden starting state only
 * applies under html.reveal-ready, and anything already on screen is marked
 * in view first, so nothing visible blinks out.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("reveal-ready");
      return;
    }

    const show = (el: Element) => el.setAttribute("data-inview", "");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    const scan = () => {
      document.querySelectorAll("[data-reveal]:not([data-inview])").forEach((el) => {
        const r = el.getBoundingClientRect();
        // Already on screen before animations switch on: leave it visible.
        if (!root.classList.contains("reveal-ready") && r.top < window.innerHeight && r.bottom > 0) show(el);
        else io.observe(el);
      });
    };
    scan();
    root.classList.add("reveal-ready");

    // Parallax: one rAF-throttled scroll handler for all [data-parallax].
    let ticking = false;
    const updateParallax = () => {
      ticking = false;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty("--p", Math.max(-1, Math.min(1, p)).toFixed(3));
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Pick up elements that mount later (client components, modals).
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
