import BorderBeam from "@/components/BorderBeam";
import SpotlightCard from "@/components/SpotlightCard";
import styles from "./WhyChooseUs.module.css";

const REASONS = [
  {
    number: "01",
    title: "Strategy first",
    description:
      "Every project starts with clear goals, so design and development stay focused on results.",
  },
  {
    number: "02",
    title: "Design that converts",
    description:
      "Clean visuals and thoughtful UX that help your brand stand out and turn visitors into clients.",
  },
  {
    number: "03",
    title: "Built to last",
    description:
      "Reliable builds, smooth handoff, and support that keeps your digital presence running strong.",
  },
] as const;

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className={styles.section}
      aria-label="Why Choose Us"
    >
      <div className={styles.inner}>
        <SpotlightCard
          className={styles.card}
          spotlightColor="rgba(255, 255, 255, 0.28)"
        >
          <div className={styles.waves} aria-hidden />
          <div className={styles.content}>
            <span className={styles.badge}>Why Choose Us</span>
            <h2 className={styles.heading}>
              Built for brands that want more than just a website.
            </h2>
            <p className={styles.description}>
              We combine strategy, design, and development into one clear
              process — so your digital presence looks sharp, works hard, and
              grows with you.
            </p>
          </div>

          <div className={styles.grid}>
            {REASONS.map((reason) => (
              <article key={reason.number} className={styles.featureCard}>
                <BorderBeam className={styles.featureBeam} compact tone="black">
                  <div className={styles.featureInner}>
                    <span className={styles.featureNumber}>{reason.number}</span>
                    <h3 className={styles.featureTitle}>{reason.title}</h3>
                    <p className={styles.featureBody}>{reason.description}</p>
                  </div>
                </BorderBeam>
              </article>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
