"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./About.module.css";

type AnimatedStatProps = {
  value?: number;
  suffix?: string;
  duration?: number;
  label: string;
};

export default function AnimatedStat({
  value = 100,
  suffix = "+",
  duration = 1600,
  label,
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, duration]);

  return (
    <div ref={ref} className={styles.stat}>
      <p className={styles.statValue}>
        {display}
        {suffix}
      </p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}
