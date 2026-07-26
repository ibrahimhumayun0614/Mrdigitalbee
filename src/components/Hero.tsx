import SideRays from "@/components/SideRays";
import CtaArrow from "@/components/CtaArrow";
import SplitText from "@/components/SplitText";
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
        <p className={styles.badge}>
          Digital Agency · Strategy · Design · Growth
        </p>

        <SplitText
          tag="h1"
          className={styles.headline}
          text="Digital experiences that grow brands—built to perform"
          delay={40}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-80px"
          textAlign="center"
        />

        <p className={styles.subhead}>
          One partner for strategy, design, and campaigns.
          <br />
          We craft what converts—without the agency noise.
        </p>

        <a href="#contact" data-cta className={styles.cta}>
          <span>Start a project</span>
          <span className={styles.ctaArrow}>
            <CtaArrow />
          </span>
        </a>
      </div>
    </section>
  );
}
