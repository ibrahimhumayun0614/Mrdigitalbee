"use client";

import { useMemo, useState } from "react";
import BorderBeam from "@/components/BorderBeam";
import CtaArrow from "@/components/CtaArrow";
import styles from "./Projects.module.css";

const TABS = ["Websites", "CRMs", "Logo Design"] as const;

type Tab = (typeof TABS)[number];

const PROJECTS = [
  {
    title: "Cedar Co.",
    category: "Websites" as Tab,
    description: "A calm editorial website for a lifestyle and home brand.",
  },
  {
    title: "Lumen Agency",
    category: "Websites" as Tab,
    description:
      "A sharp marketing site built to showcase services and case studies.",
  },
  {
    title: "Pulse Studio",
    category: "Websites" as Tab,
    description:
      "Identity-led portfolio site for a creative production house.",
  },
  {
    title: "Nova Commerce",
    category: "Websites" as Tab,
    description:
      "A conversion-focused storefront for a growing retail brand.",
  },
  {
    title: "Harbor Health",
    category: "Websites" as Tab,
    description:
      "A clear, trustworthy website for a multi-location clinic network.",
  },
  {
    title: "Orbit CRM",
    category: "CRMs" as Tab,
    description:
      "A lightweight CRM dashboard for sales teams tracking leads and deals.",
  },
  {
    title: "Nova Pipeline",
    category: "CRMs" as Tab,
    description:
      "Pipeline management tools with clean reporting and client follow-ups.",
  },
  {
    title: "Harbor Connect",
    category: "CRMs" as Tab,
    description:
      "Client relationship workspace for care teams and account managers.",
  },
  {
    title: "Lumen Marks",
    category: "Logo Design" as Tab,
    description:
      "A clean, scalable mark system for a modern consulting firm.",
  },
  {
    title: "Orbit Symbol",
    category: "Logo Design" as Tab,
    description:
      "A bold, simple logo built for digital and print applications.",
  },
  {
    title: "Harbor Crest",
    category: "Logo Design" as Tab,
    description:
      "A trustworthy mark and lockup for a healthcare clinic network.",
  },
] as const;

export default function Projects() {
  const [activeTab, setActiveTab] = useState<Tab>("Websites");

  const filtered = useMemo(
    () => PROJECTS.filter((project) => project.category === activeTab),
    [activeTab],
  );

  return (
    <section id="projects" className={styles.projects} aria-label="Projects">
      <div className={styles.inner}>
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
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className={styles.grid}>
          {filtered.map((project, index) => (
            <article
              key={project.title}
              className={`${styles.card} ${index === 0 ? styles.cardFeatured : ""}`}
            >
              <BorderBeam className={styles.beam} tone="black" compact>
                <div className={styles.cardBody}>
                  <div className={styles.media} aria-hidden>
                    <span className={styles.mediaLabel}>{project.category}</span>
                  </div>
                  <div className={styles.copy}>
                    <p className={styles.category}>{project.category}</p>
                    <h3 className={styles.title}>{project.title}</h3>
                    <p className={styles.description}>{project.description}</p>
                  </div>
                </div>
              </BorderBeam>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
