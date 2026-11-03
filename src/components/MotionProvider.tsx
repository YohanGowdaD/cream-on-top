"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { editorialEase } from "@/lib/motion";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.65, ease: editorialEase }}>
      {children}
    </MotionConfig>
  );
}
