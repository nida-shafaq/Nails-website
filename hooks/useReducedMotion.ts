"use client";

import { useEffect, useState } from "react";

/**
 * useReducedMotion — Returns true if the user prefers reduced motion.
 * Used throughout the app to disable/reduce animations for accessibility.
 * This is a client-side hook; server components should not call it.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
