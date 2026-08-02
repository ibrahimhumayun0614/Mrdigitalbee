"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import CtaArrow from "@/components/CtaArrow";
import { motionEase, springSnappy } from "@/components/MotionReveal";
import { Button } from "@/components/ui/button";
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
  const [scrolled, setScrolled] = useState(false);

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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <motion.header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: motionEase }}
    >
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

        <motion.a
          href="#contact"
          data-cta
          className={`${styles.cta} ${styles.desktopCta}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={springSnappy}
        >
          <span>Contact Us</span>
          <span className={styles.ctaArrow}>
            <CtaArrow />
          </span>
        </motion.a>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={styles.menuToggle}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X className={styles.menuIcon} strokeWidth={2} />
          ) : (
            <Menu className={styles.menuIcon} strokeWidth={2} />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            className={`${styles.mobilePanel} ${styles.mobilePanelOpen}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: motionEase }}
          >
            {NAV_ITEMS.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`${styles.mobileLink} ${
                  activeHref === item.href ? styles.mobileLinkActive : ""
                }`}
                onClick={closeMenu}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + index * 0.04, ease: motionEase }}
              >
                {item.label}
              </motion.a>
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
