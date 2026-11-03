"use client";

import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Reveal } from "./Reveal";
import { editorialEase } from "@/lib/motion";
import styles from "./OrderingProcess.module.css";

const steps = [
  ["Tell Us Your Idea", "Send us your cake requirements and reference images."],
  ["Share Your Preferences", "Tell us your preferred flavour, size, date and design."],
  ["Receive Your Quote", "We review your requirements and share pricing."],
  ["Confirm Your Order", "Complete the confirmation process directly with the bakery."],
];

export function OrderingProcess() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotionPreference();

  return (
    <section id="the-process" className="process section-space">
      <div className="container">
        <Reveal className="section-heading centered">
          <p className="eyebrow">FROM A LITTLE IDEA TO A LOVELY MEMORY</p>
          <h2>Let’s create something <em>special.</em></h2>
          <p>A personal process. A cake that’s entirely yours.</p>
        </Reveal>
        <ol className={styles.steps} ref={ref}>
          {steps.map(([title, copy], index) => (
            <li key={title} className={styles.step}>
              <div className={styles.track} aria-hidden="true">
                <motion.span className={styles.fill} initial={false} animate={{ scaleX: inView || reduced ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : index * 0.17, ease: editorialEase }}/>
                <motion.span className={styles.point} initial={false} animate={{ scale: inView || reduced ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : index * 0.17, ease: editorialEase }}/>
              </div>
              <Reveal delay={index * 0.1}>
                <span className={styles.number}>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="centered"><a href="#enquiry" className="button button-primary">Start Your Cake Enquiry <ArrowUpRight size={16}/></a></div>
      </div>
    </section>
  );
}
