"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * MotionWrapper — Accessibility-aware animation wrapper.
 *
 * Wraps Motion (Framer Motion) components and respects prefers-reduced-motion.
 * When motion is reduced, animations are instantaneous (no tween, no spring).
 * This is applied globally via this wrapper so individual components don't
 * need to implement their own reduced-motion checks.
 */

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: string;
}

export function FadeUp({ children, delay = 0, className, as = "div" }: FadeUpProps) {
  const prefersReduced = useReducedMotion();

  const variants: Variants = {
    hidden: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0.01 : 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: prefersReduced ? 0 : delay,
      },
    },
  };

  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.08 }: StaggerContainerProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReduced ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: prefersReduced ? 0.01 : 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { AnimatePresence };
