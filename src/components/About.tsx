"use client";

import type { CSSProperties } from "react";
import AnimatedStat from "@/components/AnimatedStat";
import MotionReveal from "@/components/MotionReveal";
import ScrollVelocity from "@/components/ScrollVelocity";
import SpotlightCard from "@/components/SpotlightCard";
import styles from "./About.module.css";

const TAGS = [
  { label: "Marketing", rotate: -8 },
  { label: "Web Design", rotate: 6 },
  { label: "Product Design", rotate: -4 },
  { label: "SEO", rotate: 10 },
  { label: "Brand Positioning", rotate: -6 },
  { label: "Web Design", rotate: 5 },
] as const;

export default function About() {
  return (
    <section id="about" className={styles.about} aria-label="About Us">
      <div className={styles.inner}>
        <div className={styles.front}>
          <MotionReveal className={styles.copy} y={36}>
            <span className={styles.badge}>About us</span>
            <div className={styles.headingWrap}>
              <h2 className={styles.heading}>
                From Small Beginnings to Big Ambitions
              </h2>
            </div>
            <div className={styles.bodyStack}>
              <p className={styles.body}>
                It started with a small win — my friend got his first payment for
                a design project. That moment sparked an idea: why not combine our
                skills in web development and graphic design to offer digital
                services together?
              </p>
              <p className={styles.body}>
                We began sharing our work on social media and relied on referrals
                from friends and early clients. Slowly, inquiries started coming
                in, and our side hustle turned into something real. Now,
                we&apos;re a small, passionate team built on creativity, trust,
                and community support.
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12} y={40} x={16} className={styles.panelSlot}>
            <SpotlightCard
              className={styles.darkCard}
              spotlightColor="rgba(255, 255, 255, 0.28)"
            >
              <div className={styles.panel}>
                <div className={styles.waves} aria-hidden />
                <div className={styles.panelContent}>
                  <div className={styles.stats}>
                    <AnimatedStat
                      value={100}
                      suffix="+"
                      label="Projects Completed"
                    />
                    <AnimatedStat
                      value={99}
                      suffix="%"
                      label="Client Satisfaction"
                    />
                  </div>
                  <div className={styles.tags}>
                    {TAGS.map((tag, index) => (
                      <span
                        key={`${tag.label}-${index}`}
                        className={styles.tag}
                        style={
                          {
                            "--tag-rotate": `${tag.rotate}deg`,
                            animationDelay: `${index * 0.12}s`,
                          } as CSSProperties
                        }
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </MotionReveal>
        </div>

        <MotionReveal delay={0.08} y={28}>
          <SpotlightCard
            className={`${styles.fullBlackSlot} ${styles.darkCard}`}
            spotlightColor="rgba(255, 255, 255, 0.28)"
          >
            <div className={styles.fullBlack}>
              <div className={styles.waves} aria-hidden />
              <div className={styles.scrollVelocityWrap}>
                <ScrollVelocity
                  texts={[
                    "Website Development",
                    "Website Maintenance · Logo Design",
                  ]}
                  velocity={28}
                  numCopies={6}
                  damping={60}
                  stiffness={200}
                  velocityMapping={{ input: [0, 1000], output: [0, 1.2] }}
                  className={styles.scrollText}
                />
              </div>
            </div>
          </SpotlightCard>
        </MotionReveal>
      </div>
    </section>
  );
}
