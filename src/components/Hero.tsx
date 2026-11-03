"use client";

import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { editorialEase, gentleSpring } from "@/lib/motion";
import styles from "./Hero.module.css";

const lines = ["Every celebration", "deserves something", "extraordinary."];

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const depth = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 34]);
  const sealRotation = useTransform(scrollYProgress, [0, 1], [-9, reduced ? -9 : 8]);
  const pointerX = useSpring(0, gentleSpring);
  const pointerY = useSpring(0, gentleSpring);

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse" || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 9);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 7);
  }

  const entrance = (delay: number) => ({ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : delay, ease: editorialEase });

  return (
    <section ref={section} id="home" className={styles.hero}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <motion.p className={styles.eyebrow} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={entrance(0.05)}>
            <span aria-hidden="true">✧</span> A BOUTIQUE CAKE STUDIO · BANGALORE
          </motion.p>
          <h1 className={styles.title} aria-label="Every celebration deserves something extraordinary.">
            {lines.map((line, index) => (
              <span className={styles.lineMask} key={line} aria-hidden="true">
                <motion.span className={index === 2 ? styles.italicLine : styles.line}
                  initial={{ y: "105%", rotate: 2, opacity: 0 }} animate={{ y: "0%", rotate: 0, opacity: 1 }}
                  transition={{ duration: reduced ? 0 : 1.05, delay: reduced ? 0 : 0.14 + index * 0.13, ease: editorialEase }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={entrance(0.48)}>
            <p className={styles.description}>Thoughtfully crafted cakes, made with love,<br className={styles.break}/> creativity and a little magic.</p>
            <div className={styles.actions}>
              <a href="#collections" className="button button-primary">Explore Our Creations <ArrowRight size={17}/></a>
              <a href="#enquiry" className="text-link">Create Your Cake <ArrowUpRight size={16}/></a>
            </div>
          </motion.div>
          <motion.div className={styles.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={entrance(0.75)}>
            <span className={styles.noteRule} aria-hidden="true"/>
            <span>Handcrafted in Bangalore.<br/><span>Made for your special moments.</span></span>
          </motion.div>
        </div>
        <div className={styles.visual} onPointerMove={followPointer} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
          <div className={styles.backdrop} aria-hidden="true"/>
          <motion.div className={styles.frameLine} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={entrance(0.55)} aria-hidden="true"/>
          <motion.div className={styles.photograph} initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: reduced ? 0 : 1.3, delay: reduced ? 0 : 0.08, ease: editorialEase }}>
            <motion.div className={styles.depthLayer} style={{ y: depth }}>
              <motion.div className={styles.imageLayer} style={{ x: reduced ? 0 : pointerX, y: reduced ? 0 : pointerY }}
                initial={{ scale: 1.1 }} animate={{ scale: 1.02 }} transition={{ duration: reduced ? 0 : 1.8, ease: editorialEase }}>
                <Image src="/images/generated/hero-cover.webp" alt="AI-generated cake inspiration: an ivory and blush two-tier cake with sugar roses, pearl piping and a cascading fondant bow" fill loading="eager" fetchPriority="high" sizes="(max-width: 767px) 85vw, (max-width: 1200px) 40vw, 440px" quality={90} style={{ objectPosition: "50% 50%" }}/>
              </motion.div>
            </motion.div>
            <span className={styles.photoLabel}>AI-GENERATED INSPIRATION</span>
          </motion.div>
          <motion.div className={styles.seal} style={{ rotate: sealRotation }} initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={entrance(0.8)}>
            <span className={styles.sealRing} aria-hidden="true"/>
            <Sparkles size={19} strokeWidth={1}/>
            <span>A little love<br/>in every layer.</span>
            <small>MADE JUST FOR YOU</small>
          </motion.div>
          <motion.div className={styles.photoFootnote} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={entrance(0.95)}>
            <span>THE ART OF CELEBRATION</span><span>01 / MADE WITH LOVE</span>
          </motion.div>
          <span className={styles.verticalCaption} aria-hidden="true">THOUGHTFULLY DESIGNED. BEAUTIFULLY HANDMADE.</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <a href="#introduction" className={styles.scrollCue}><span className={styles.scrollTrack} aria-hidden="true"><ArrowDown size={14}/></span> A LITTLE MORE SWEETNESS BELOW</a>
        <span className={styles.bottomNote}>Your moment. Your story. <em>Your cake.</em></span>
      </div>
    </section>
  );
}
