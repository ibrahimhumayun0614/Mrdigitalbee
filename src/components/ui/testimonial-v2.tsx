"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  name: string;
  location: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Impressive work and smooth delivery. The strategic insights and regular updates on industry trends were especially valuable. Grateful for the consistent support—highly recommend their services.",
    name: "Ananth",
    location: "Singapore",
    role: "Global Taekwondo Academy",
  },
  {
    text: "The team did a fantastic job building our website. They captured the essence of our HVAC services with a clean, professional design. The process was smooth, and we appreciated their attention to detail and timely delivery. Highly recommended for any UAE-based business looking for a reliable web development partner.",
    name: "Jamal",
    location: "UAE",
    role: "Manager - Al Falaq Technical Services Co. L.L.C",
  },
  {
    text: "The site looks nice and works well on phone and computer. Our customers are also finding it easy to use. We're happy with the work and would surely recommend him to others.",
    name: "Kalyan",
    location: "UAE",
    role: "Octare - Senior Executive Officer",
  },
  {
    text: "Working with Mr. Muhammed was excellent for our UAE-based insurance website project. His team delivered a modern, user-friendly site on time and within budget, with strong post-launch support. We highly recommend their web development services.",
    name: "Vinoth Arumugam",
    location: "UAE",
    role: "SSTGULF - Founder & CEO",
  },
  {
    text: "They designed our logo and custom icons with real care for the brand. Everything feels consistent, polished, and ready to use across the platform. Highly recommend their branding work.",
    name: "Dhivya Srinivasan",
    location: "India",
    role: "PlanMyKalayanam",
  },
];

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  const [canHover, setCanHover] = useState(false);
  const [columnDuration, setColumnDuration] = useState(props.duration || 70);

  useEffect(() => {
    const hoverMq = window.matchMedia("(hover: hover)");
    const mobileMq = window.matchMedia("(max-width: 768px)");
    const sync = () => {
      setCanHover(hoverMq.matches);
      const base = props.duration || 70;
      setColumnDuration(mobileMq.matches ? base * 1.35 : base);
    };
    sync();
    hoverMq.addEventListener("change", sync);
    mobileMq.addEventListener("change", sync);
    return () => {
      hoverMq.removeEventListener("change", sync);
      mobileMq.removeEventListener("change", sync);
    };
  }, [props.duration]);

  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: columnDuration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="m-0 flex list-none flex-col gap-6 bg-transparent p-0 pb-6 transition-colors duration-300"
        style={{ willChange: "transform" }}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(
                ({ text, name, location, role }, i) => (
                  <motion.li
                    key={`${index}-${i}`}
                    aria-hidden={index === 1}
                    tabIndex={index === 1 ? -1 : 0}
                    whileHover={
                      canHover
                        ? {
                            scale: 1.02,
                            y: -6,
                            boxShadow:
                              "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 17,
                            },
                          }
                        : undefined
                    }
                    whileFocus={
                      canHover
                        ? {
                            scale: 1.02,
                            y: -6,
                            boxShadow:
                              "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 17,
                            },
                          }
                        : undefined
                    }
                    className="group w-full cursor-default select-none rounded-[1.5rem] border border-neutral-200 bg-white p-5 shadow-[0_12px_28px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/20 sm:p-8"
                  >
                    <blockquote className="m-0 p-0">
                      <p
                        className="m-0 font-normal leading-[1.65] text-[#6b6b6b]"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--font-size-description)",
                        }}
                      >
                        {text}
                      </p>
                      <footer className="mt-6 flex flex-col gap-1">
                        <cite
                          className="not-italic text-[0.85rem] font-bold uppercase tracking-[0.04em] text-[var(--color-primary)]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {name} - {location}
                        </cite>
                        <span
                          className="break-words text-[0.78rem] font-semibold uppercase leading-5 tracking-[0.03em] text-[#5c5c5c] normal-case sm:uppercase"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {role}
                        </span>
                      </footer>
                    </blockquote>
                  </motion.li>
                ),
              )}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-[var(--color-secondary)] px-4 py-12 md:py-[3rem]"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.7 },
        }}
        className="relative z-10 mx-auto w-full max-w-[1280px]"
      >
        <div className="mb-12 flex max-w-[36rem] flex-col items-start">
          <span
            className="inline-flex items-center rounded-full bg-[#e4e4e4] px-[0.9rem] py-[0.35rem] text-[0.78rem] font-medium text-[#5c5c5c]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Testimonials
          </span>

          <h2
            id="testimonials-heading"
            className="mt-[0.95rem] text-left text-[clamp(1.55rem,3vw,2.35rem)] font-bold leading-[1.15] tracking-[-0.03em] text-[var(--color-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What our clients say
          </h2>
          <p
            className="mt-[0.65rem] max-w-[32rem] text-left leading-[1.65] text-[#6b6b6b]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--font-size-description)",
            }}
          >
            Real feedback from teams we&apos;ve helped design, build, and grow
            online.
          </p>
        </div>

        <div
          className="mt-10 grid max-h-[740px] grid-cols-1 gap-[1.15rem] overflow-hidden md:grid-cols-2 lg:grid-cols-3 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn
            testimonials={testimonials}
            duration={70}
            className="min-w-0"
          />
          <TestimonialsColumn
            testimonials={[...testimonials].reverse()}
            className="hidden min-w-0 md:block"
            duration={80}
          />
          <TestimonialsColumn
            testimonials={testimonials}
            className="hidden min-w-0 lg:block"
            duration={75}
          />
        </div>
      </motion.div>
    </section>
  );
}
