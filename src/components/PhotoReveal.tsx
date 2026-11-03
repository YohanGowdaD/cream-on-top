"use client";

import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";

import { ViewportImage as Image } from "./ViewportImage";
import { motion, useAnimationControls, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { editorialEase } from "@/lib/motion";
import styles from "./PhotoReveal.module.css";

type Props = { src: string; alt: string; sizes: string; className?: string; position?: string };

export function PhotoReveal({ src, alt, sizes, className = "", position = "center" }: Props) {
  // Keep the observed frame outside the clipping mask so it can enter the viewport.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const reduced = useReducedMotionPreference();
  const controls = useAnimationControls();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -12, reduced ? 0 : 12]);

  useEffect(() => {
    if (reduced) controls.set({ clipPath: "inset(0 0 0% 0)" });
    else if (inView) void controls.start({ clipPath: "inset(0 0 0% 0)", transition: { duration: 1.15, ease: editorialEase } });
    else controls.set({ clipPath: "inset(0 0 100% 0)" });
  }, [controls, inView, reduced]);

  return (
    <div ref={ref} className={`${styles.frame} ${className}`}>
      <motion.div className={styles.mask} initial={false} animate={controls}>
        <motion.div className={styles.imageSurface} style={{ y }}>
          <Image src={src} alt={alt} fill quality={90} sizes={sizes} style={{ objectPosition: position }}/>
        </motion.div>
      </motion.div>
    </div>
  );
}
