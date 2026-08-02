"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const isTouch = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;

    const lenis = new Lenis({
      // Soft, Framer-like inertia on wheel / touch
      duration: isTouch ? 1.55 : 1.45,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: isTouch,
      syncTouchLerp: isTouch ? 0.055 : 0.07,
      touchInertiaExponent: isTouch ? 1.15 : 1.35,
      touchMultiplier: isTouch ? 1.05 : 0.95,
      wheelMultiplier: 0.72,
      autoRaf: false,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Keep Framer Motion scroll-linked animations in sync with Lenis
    lenis.on("scroll", () => {
      window.dispatchEvent(new Event("scroll"));
    });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return children;
}
