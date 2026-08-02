"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BorderBeam from "@/components/BorderBeam";
import MotionReveal from "@/components/MotionReveal";
import styles from "./Process.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    number: "01",
    title: "Define",
    description:
      "We dive deep into your goals, audience, and market to craft a solid strategy that sets the foundation for success.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Our creative team brings ideas to life with designs that are visually stunning, user-friendly, and aligned with your brand.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We develop and build with precision, ensuring every element works seamlessly across all platforms.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "We launch your project and ensure a smooth rollout, optimizing performance for maximum impact.",
  },
] as const;

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const cards = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(`.${styles.card}`),
      );
      const pathSvg = section.querySelector(`.${styles.path}`);
      const delivery = section.querySelector(`.${styles.delivery}`);
      const track = section.querySelector(`.${styles.track}`);

      if (reduceMotion) {
        gsap.set([cards, delivery, pathSvg], { clearProps: "all" });
        return;
      }

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const motionScale = isMobile ? 0.45 : 1;
      const durationScale = isMobile ? 1.35 : 1;

      gsap.set(delivery, { opacity: 0, x: isMobile ? -12 : -24 });

      if (pathSvg && !isMobile) {
        gsap.fromTo(
          pathSvg,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: {
              trigger: track ?? section,
              start: "top 70%",
              end: "bottom 50%",
              scrub: 1.1,
            },
          },
        );
      }

      cards.forEach((card, index) => {
        const fromRight = index % 2 === 0;
        const restRotate = isMobile ? 0 : fromRight ? 3 : -3;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 36 * motionScale,
            x: (fromRight ? 28 : -28) * motionScale,
            scale: isMobile ? 0.99 : 0.97,
            rotate: isMobile ? 0 : fromRight ? 7 : -7,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotate: restRotate,
            duration: 0.85 * durationScale,
            ease: isMobile ? "power2.out" : "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );

        const pin = card.querySelector(`.${styles.pin}`);
        if (pin) {
          gsap.fromTo(
            pin,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.45 * durationScale,
              ease: isMobile ? "power2.out" : "back.out(1.8)",
              delay: 0.15,
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });

      gsap.to(delivery, {
        opacity: 1,
        x: 0,
        duration: 0.7 * durationScale,
        ease: "power2.out",
        scrollTrigger: {
          trigger: delivery,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className={styles.process}
      aria-label="Our Process"
    >
      <div className={styles.inner}>
        <div className={styles.track}>
          <svg
            className={styles.path}
            viewBox="0 0 1280 900"
            fill="none"
            aria-hidden
            preserveAspectRatio="none"
          >
            <path
              className={styles.pathLine}
              vectorEffect="nonScalingStroke"
              d="M 220 155
                 C 280 195, 920 170, 980 240
                 C 1040 310, 280 340, 240 420
                 C 200 500, 1000 520, 1020 600
                 C 1040 680, 280 710, 240 780
                 C 210 845, 900 885, 1120 895"
            />
          </svg>

          <MotionReveal y={24}>
            <header className={styles.header}>
              <span className={styles.badge}>Our Process</span>
              <h2 className={styles.heading}>
                Let us show you how we drive your brand to new heights.
              </h2>
              <p className={styles.lead}>
                From concept to final product, our streamlined process ensures
                results that make an impact.
              </p>
            </header>
          </MotionReveal>

          <div className={styles.flow}>
            <ol className={styles.steps}>
              {STEPS.map((step, index) => (
                <li
                  key={step.number}
                  className={`${styles.step} ${
                    index % 2 === 0 ? styles.stepRight : styles.stepLeft
                  }`}
                >
                  <article
                    className={`${styles.card} ${
                      index % 2 === 0
                        ? styles.cardTiltRight
                        : styles.cardTiltLeft
                    }`}
                  >
                    <BorderBeam tone="black">
                      <span className={styles.pinWrap} aria-hidden>
                        <span className={styles.pin} />
                      </span>
                      <div className={styles.cardInner}>
                        <span className={styles.number}>{step.number}</span>
                        <h3 className={styles.cardTitle}>{step.title}</h3>
                        <p className={styles.cardBody}>{step.description}</p>
                      </div>
                    </BorderBeam>
                  </article>
                </li>
              ))}
            </ol>

            <div className={styles.delivery}>
              <BorderBeam className={styles.deliveryBeam} compact tone="black">
                <p className={styles.deliveryText}>Ready to be delivered!</p>
              </BorderBeam>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
