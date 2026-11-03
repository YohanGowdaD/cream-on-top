"use client";

import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";

import { motion, useAnimationControls, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { editorialEase } from "@/lib/motion";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const entered = useInView(ref, { once: true, amount: 0.08 });
  const controls = useAnimationControls();

  useEffect(() => {
    if (reduced) {
      controls.set({ opacity: 1, y: 0 });
    } else if (entered) {
      void controls.start({ opacity: 1, y: 0, transition: { duration: 0.85, delay, ease: editorialEase } });
    } else {
      controls.set({ opacity: 0, y: 28 });
    }
  }, [controls, delay, entered, reduced]);

  return (
    <motion.div ref={ref} className={`reveal ${className}`} initial={false} animate={controls}>
      {children}
    </motion.div>
  );
}
