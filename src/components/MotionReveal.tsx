"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";

/** Framer-style ease — soft decelerate */
export const motionEase = [0.22, 1, 0.36, 1] as const;

export const springSoft = {
  type: "spring" as const,
  stiffness: 90,
  damping: 20,
  mass: 0.85,
};

export const springSnappy = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.7,
};

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
  amount?: number | "some" | "all";
};

export default function MotionReveal({
  children,
  className,
  delay = 0,
  y = 32,
  x = 0,
  once = true,
  amount = 0.2,
}: MotionRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, amount, margin: "0px 0px -6% 0px" }}
      transition={{
        duration: 0.9,
        delay,
        ease: motionEase,
      }}
    >
      {children}
    </motion.div>
  );
}

type MotionStaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
};

export function MotionStagger({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0.05,
}: MotionStaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -6% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.75, ease: motionEase },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
