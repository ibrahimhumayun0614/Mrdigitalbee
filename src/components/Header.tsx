"use client";

import { useEffect, useState } from "react";
import CtaArrow from "@/components/CtaArrow";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export default function Header() {
  const [activeHref, setActiveHref] = useState("#home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ids = [
      "home",
      "about",
      "services",
      "projects",
      "testimonials",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#home" className={styles.logo} onClick={closeMenu}>
          <img
            src="/logo.png"
            alt=""
            width={36}
            height={33}
            className={styles.logoMark}
          />
          <span>Mrdigital Bee</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.link} ${
                activeHref === item.href ? styles.linkActive : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          data-cta
          className={`${styles.cta} ${styles.desktopCta}`}
        >
          <span>Contact Us</span>
          <span className={styles.ctaArrow}>
            <CtaArrow />
          </span>
        </a>

        <button
          type="button"
          className={`${styles.menuToggle} ${
            menuOpen ? styles.menuToggleOpen : ""
          }`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`${styles.mobilePanel} ${
          menuOpen ? styles.mobilePanelOpen : ""
        }`}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`${styles.mobileLink} ${
              activeHref === item.href ? styles.mobileLinkActive : ""
            }`}
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}
        <a
          href="#contact"
          data-cta
          className={`${styles.cta} ${styles.mobileCta}`}
          onClick={closeMenu}
        >
          <span>Contact Us</span>
          <span className={styles.ctaArrow}>
            <CtaArrow />
          </span>
        </a>
      </div>
    </header>
  );
}
