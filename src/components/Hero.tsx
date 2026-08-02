"use client";

import { motion } from "motion/react";
import SideRays from "@/components/SideRays";
import CtaArrow from "@/components/CtaArrow";
import SplitText from "@/components/SplitText";
import { motionEase, springSoft } from "@/components/MotionReveal";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="home" className={styles.hero} aria-label="Home">
      <div className={styles.mesh} aria-hidden />
      <div className={styles.glow} aria-hidden />
      <div className={styles.rays} aria-hidden>
        <SideRays
          speed={2.2}
          rayColor1="#EFEFEF"
          rayColor2="#FFFFFF"
          intensity={1.2}
          spread={2.4}
          origin="bottom-center"
          tilt={0}
          saturation={0.35}
          blend={0.7}
          falloff={1.45}
          opacity={0.22}
        />
      </div>
      <div className={styles.content}>
        <motion.p
          className={styles.badge}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: motionEase, delay: 0.1 }}
        >
          Digital Agency · Strategy · Design · Growth
        </motion.p>

        <SplitText
          tag="h1"
          className={styles.headline}
          text="Digital experiences that grow brands—built to perform"
          delay={28}
          duration={0.85}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 36 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-80px"
          textAlign="center"
        />

        <motion.p
          className={styles.subhead}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: motionEase, delay: 0.55 }}
        >
          One partner for strategy, design, and campaigns.
          <br />
          We craft what converts—without the agency noise.
        </motion.p>

        <motion.a
          href="#contact"
          data-cta
          className={styles.cta}
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...springSoft, delay: 0.75 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Start a project</span>
          <span className={styles.ctaArrow}>
            <CtaArrow />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
