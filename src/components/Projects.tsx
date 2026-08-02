"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import BorderBeam from "@/components/BorderBeam";
import CtaArrow from "@/components/CtaArrow";
import LogoLoop, { type LogoItem } from "@/components/LogoLoop";
import MotionReveal from "@/components/MotionReveal";
import styles from "./Projects.module.css";

const TABS = ["Websites", "Logo Design"] as const;

type Tab = (typeof TABS)[number];

type Project = {
  title: string;
  category: Tab;
  description: readonly string[];
  url?: string;
  image?: string;
};

const PROJECTS: Project[] = [
  {
    title: "Credora Finance",
    category: "Websites",
    description: [
      "A modern, multi-page marketing website built for Credora Finance, a UAE-based financial brokerage connecting individuals and businesses with top banks across the Emirates.",
      "The site showcases their core services — credit cards, personal loans, auto finance, home finance, SME loans, and payroll accounts — through a clean, conversion-focused layout designed to build trust and drive consultation bookings.",
    ],
    url: "https://credorafinance.com/",
    image: "/projects/credora-finance.png",
  },
  {
    title: "Dream Home Solar",
    category: "Websites",
    description: [
      "Dream Home Solar is a full business website built for a Tamil Nadu-based solar energy provider, covering everything from rooftop and commercial installations to solar fencing and batteries. It features an interactive cost & load calculator that helps users estimate system size, panel count, and pricing based on their energy usage.",
      "Integrations include a Zoho Books client portal, Cashfree payments, and WhatsApp support.",
    ],
    url: "https://dreamhomesolar.in/",
    image: "/projects/dream-home-solar.png",
  },
  {
    title: "Capstone Insurance",
    category: "Websites",
    description: [
      "Capstone Insurance Brokers is a WordPress-built website for a Dubai-based insurance brokerage regulated by the Central Bank of UAE, serving individuals and businesses across the GCC since 2004. It walks visitors through a simple 3-step process — share your needs, compare plans, get covered — across five insurance categories: motor, life, medical, travel, and general.",
      "The site includes dedicated service pages, a \"Get a Quote\" lead capture flow, an FAQ section, client testimonials, and an integrated blog for insurance tips.",
    ],
    url: "https://capstoneinsurance.ae/",
    image: "/projects/capstone-insurance.png",
  },
  {
    title: "Holiday Movers",
    category: "Websites",
    description: [
      "A professional, service-driven website built for Holiday Movers, a moving company based in Scarborough, Ontario, serving customers across Canada with local, long-distance, and cross-province relocations.",
      "The site is positioned around the tagline \"We Go Global — The Most Reliable Moving Network in Canada,\" and is designed to build trust quickly while making it effortless for visitors to request a quote.",
    ],
    url: "https://holidaymovers.ca/",
    image: "/projects/holiday-movers.png",
  },
  {
    title: "Taekwondo Singapore",
    category: "Websites",
    description: [
      "A single-page website built for Global Taekwondo Academy, a Singapore-based Taekwondo training centre with two physical branches, offering structured programs from early childhood through elite and black-belt level.",
      "The site is built as an organic lead-generation engine — using clear program breakdowns, credibility markers, and social proof to turn website visitors into trial-class sign-ups, without relying on paid traffic or heavy video marketing.",
    ],
    url: "https://taekwondosingapore.com/",
    image: "/projects/taekwondo-singapore.png",
  },
  {
    title: "A.K. Enterprises",
    category: "Logo Design",
    description: [
      "A nautical identity for A.K. Enterprises & Logistics with ship wheel, stars, and anchor.",
      "Clean hierarchy with the tagline \"Moving The Impossible.\"",
    ],
    image: "/projects/logos/ak-enterprises.png",
  },
  {
    title: "Southern Peak",
    category: "Logo Design",
    description: [
      "A Western Ghats food brand identity with grain motifs and circular framing.",
      "Warm green and gold palette for Southern Peak Food Products.",
    ],
    image: "/projects/logos/southern-peak.png",
  },
  {
    title: "Southern Peak Gold",
    category: "Logo Design",
    description: [
      "An alternate Southern Peak lockup focused on Western Ghats grain symbolism.",
      "Curved type and wheat forms for food product branding.",
    ],
    image: "/projects/logos/southern-peak-gold.png",
  },
  {
    title: "Maar Agro Products",
    category: "Logo Design",
    description: [
      "A hexagonal agro mark with leaf and field motifs for Maar Agro Products.",
      "Earthy greens for agricultural packaging and brand systems.",
    ],
    image: "/projects/logos/maar-agro-products.png",
  },
  {
    title: "Tech Slide Solutions",
    category: "Logo Design",
    description: [
      "An orange circular tech mark with navy wordmark for Tech Slide Solutions.",
      "Modern IT services identity with strong center alignment.",
    ],
    image: "/projects/logos/tech-slide-solutions.png",
  },
  {
    title: "Global Social Services",
    category: "Logo Design",
    description: [
      "A charitable trust emblem with embracing hands and a diverse figure star.",
      "Equity-in-health messaging wrapped in a green outer ring.",
    ],
    image: "/projects/logos/global-social-services.png",
  },
  {
    title: "BI Mark",
    category: "Logo Design",
    description: [
      "A purple B monogram with a figure-like negative space.",
      "Minimal mark built for strong recall at small sizes.",
    ],
    image: "/projects/logos/bi-mark.png",
  },
  {
    title: "Rewarding Spends",
    category: "Logo Design",
    description: [
      "A globe-centered rewards brand mixing rupee and dollar symbolism.",
      "Travel and shopping cues for a lifestyle finance identity.",
    ],
    image: "/projects/logos/rewarding-spends.png",
  },
  {
    title: "Deep Dive Technologies",
    category: "Logo Design",
    description: [
      "A pixel-meets-curve d mark in blue and green for Deep Dive Technologies.",
      "Clean tech wordmark built for software and digital services.",
    ],
    image: "/projects/logos/deep-dive-technologies.png",
  },
  {
    title: "Universal Metals",
    category: "Logo Design",
    description: [
      "A hexagonal UM icon above a dual-tone Universal Metals banner.",
      "Industrial identity with clear hierarchy for metals trading.",
    ],
    image: "/projects/logos/universal-metals.png",
  },
  {
    title: "MMK Traders",
    category: "Logo Design",
    description: [
      "A concentric circular mark with a bold 777 center for MMK Traders.",
      "High-contrast blue and red lockup for trading brand applications.",
    ],
    image: "/projects/logos/mmk-traders.png",
  },
];

function ProjectCard({
  project,
  index,
  scaled,
  active,
}: {
  project: Project;
  index: number;
  scaled: MotionValue<number>;
  active: boolean;
}) {
  const depth = useTransform(scaled, (v) =>
    Math.min(Math.max(v - index, 0), 4),
  );

  const enterY = useTransform(scaled, (v) => {
    if (index === 0) return 0;
    const local = Math.min(1, Math.max(0, v - (index - 1)));
    return (1 - local) * 85;
  });

  const scale = useTransform(depth, (d) => (d < 0.02 ? 1 : 1 - d * 0.04));
  const stackY = useTransform(depth, (d) => (d < 0.02 ? 0 : -d * 26));
  const rotate = useTransform(depth, (d) => {
    if (d < 0.02) return 0;
    return (index % 2 === 0 ? -1 : 1) * d * 1.2;
  });
  const y = useTransform(
    [enterY, stackY],
    ([ev, yv]) => `calc(${ev as number}vh + ${yv as number}px)`,
  );

  return (
    <motion.article
      className={styles.slide}
      aria-hidden={active ? "false" : "true"}
      style={{
        zIndex: index,
        y,
        scale,
        rotate,
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <BorderBeam
        className={styles.beam}
        tone="black"
        compact
        active={active}
      >
        <div className={styles.cardBody}>
          <div
            className={`${styles.media} ${project.image ? styles.mediaPhoto : ""}`}
            aria-hidden
          >
            {project.image ? (
              <div className={styles.mediaFrame}>
                <Image
                  src={project.image}
                  alt=""
                  width={1600}
                  height={900}
                  quality={100}
                  sizes="(max-width: 900px) 100vw, 700px"
                  className={styles.mediaImage}
                  priority={index === 0}
                  unoptimized
                />
              </div>
            ) : (
              <>
                <span className={styles.mediaIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className={styles.mediaTitle}>{project.title}</p>
              </>
            )}
          </div>

          <div className={styles.copy}>
            <div className={styles.copyMain}>
              <span className={styles.category}>{project.category}</span>
              <h3 className={styles.title}>{project.title}</h3>
              {project.description.map((paragraph) => (
                <p key={paragraph} className={styles.description}>
                  {paragraph}
                </p>
              ))}
            </div>
            {project.url ? (
              <a
                href={project.url}
                className={styles.projectLink}
                data-cta
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={active ? 0 : -1}
              >
                <span>Visit site</span>
                <span className={styles.projectLinkArrow}>
                  <CtaArrow />
                </span>
              </a>
            ) : (
              <span className={styles.projectLinkMuted}>Coming soon</span>
            )}
          </div>
        </div>
      </BorderBeam>
    </motion.article>
  );
}

function CategoryTabs({
  activeTab,
  onChange,
}: {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <div className={styles.controls}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Project categories"
      >
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              onClick={() => onChange(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Projects() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Websites");
  const [activeIndex, setActiveIndex] = useState(0);

  const isLogoTab = activeTab === "Logo Design";

  const filtered = useMemo(
    () => PROJECTS.filter((project) => project.category === activeTab),
    [activeTab],
  );

  const stackProjects = useMemo(
    () =>
      isLogoTab
        ? PROJECTS.filter((project) => project.category === "Websites")
        : filtered,
    [filtered, isLogoTab],
  );

  const logoItems = useMemo<LogoItem[]>(
    () =>
      PROJECTS.filter((project) => project.category === "Logo Design").map(
        (project) => ({
          title: project.title,
          href: project.url,
          node: (
            <span className={styles.logoCard}>
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image}
                  alt=""
                  className={styles.logoCardImage}
                  draggable={false}
                />
              ) : (
                <span className={styles.logoLoopMark}>{project.title}</span>
              )}
            </span>
          ),
        }),
      ),
    [],
  );

  const count = Math.max(stackProjects.length, 1);
  const trackHeightVh = Math.max(count, 1) * 120;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const scaled = useTransform(scrollYProgress, (p) =>
    p * Math.max(count - 1, 0),
  );

  useMotionValueEvent(scaled, "change", (value) => {
    if (isLogoTab) return;
    const next = Math.min(count - 1, Math.max(0, Math.round(value)));
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setActiveIndex(0);
  };

  return (
    <section id="projects" className={styles.projects} aria-label="Projects">
      <div className={styles.inner}>
        <MotionReveal y={28}>
          <header className={styles.header}>
            <span className={styles.badge}>Our Projects</span>
            <div className={styles.headerRow}>
              <div className={styles.headerCopy}>
                <h2 className={styles.heading}>
                  Work that looks good and works harder.
                </h2>
                <p className={styles.lead}>
                  A selection of websites, brands, and digital products we&apos;ve
                  shaped for ambitious teams.
                </p>
              </div>
              <a href="#contact" className={styles.cta} data-cta>
                <span>Start a project</span>
                <CtaArrow />
              </a>
            </div>
          </header>
        </MotionReveal>
      </div>

      {isLogoTab ? (
        <div className={styles.logoSection}>
          <div className={styles.logoInner}>
            <CategoryTabs activeTab={activeTab} onChange={handleTabChange} />
            <div className={styles.logoLoopWrap}>
              <LogoLoop
                logos={logoItems}
                speed={90}
                direction="left"
                logoHeight={96}
                gap={24}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#efefef"
                ariaLabel="Logo design work"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div
        ref={trackRef}
        className={`${styles.scrollTrack} ${isLogoTab ? styles.scrollTrackHidden : ""}`}
        style={isLogoTab ? undefined : { height: `${trackHeightVh}vh` }}
        aria-hidden={isLogoTab}
      >
        <div className={styles.stickyPanel}>
          <div className={styles.stickyInner}>
            {!isLogoTab ? (
              <CategoryTabs activeTab={activeTab} onChange={handleTabChange} />
            ) : null}

            <div className={styles.stack} aria-live="polite">
              {stackProjects.map((project, index) => (
                <ProjectCard
                  key={`${project.category}-${project.title}`}
                  project={project}
                  index={index}
                  scaled={scaled}
                  active={!isLogoTab && index === activeIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
