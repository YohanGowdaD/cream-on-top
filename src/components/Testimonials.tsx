"use client";

import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";

import {
  AnimatePresence,
  motion,
  useIsPresent,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useId, useState } from "react";
import { testimonials } from "@/data/testimonials";
import { Reveal } from "./Reveal";
import styles from "./Testimonials.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type Review = (typeof testimonials)[number];
type ReviewMotion = { direction: number; reduced: boolean };

const reviewVariants: Variants = {
  enter: ({ direction, reduced }: ReviewMotion) => ({
    opacity: reduced ? 1 : 0,
    x: reduced ? 0 : direction * 26,
  }),
  visible: { opacity: 1, x: 0 },
  exit: ({ direction, reduced }: ReviewMotion) => ({
    opacity: 0,
    x: reduced ? 0 : direction * -18,
  }),
};

function TestimonialSlide({
  review,
  direction,
  reduced,
}: {
  review: Review;
  direction: number;
  reduced: boolean;
}) {
  const present = useIsPresent();

  return (
    <motion.div
      className={styles.slide}
      aria-hidden={!present}
      custom={{ direction, reduced }}
      variants={reviewVariants}
      initial="enter"
      animate="visible"
      exit="exit"
      transition={{ duration: reduced ? 0 : 0.48, ease: EASE }}
    >
      <blockquote className={styles.quote}>{review.quote}</blockquote>
      <div className={`testimonial-stars ${styles.stars}`} role="img" aria-label="5 out of 5 stars">
        {[0, 1, 2, 3, 4].map((index) => (
          <Star key={index} size={11} fill="currentColor" strokeWidth={1} />
        ))}
      </div>
      <p className={`${present ? "testimonial-name " : ""}${styles.name}`}>{review.name}</p>
      <p className={`testimonial-source ${styles.source}`}>A SWEET NOTE FROM OUR COMMUNITY</p>
    </motion.div>
  );
}

export function Testimonials() {
  const [[active, direction], setSelection] = useState([0, 1]);
  const reduced = Boolean(useReducedMotionPreference());
  const contentId = useId();

  function navigate(step: number) {
    setSelection(([current]) => [
      (current + step + testimonials.length) % testimonials.length,
      step,
    ]);
  }

  function onSwipe(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if ("pointerType" in event && event.pointerType === "mouse") return;
    const distance = Math.abs(info.offset.x);
    const intentionalSwipe =
      distance > Math.abs(info.offset.y) * 1.35 &&
      (distance > 55 || (distance > 28 && Math.abs(info.velocity.x) > 450));
    if (intentionalSwipe) navigate(info.offset.x < 0 ? 1 : -1);
  }

  return (
    <section id="testimonials" className="testimonials section-space">
      <div className="container">
        <Reveal className="section-heading centered">
          <p className="eyebrow">THE SWEETEST PART OF WHAT WE DO</p>
          <h2>Sweet words from <em>happy hearts.</em></h2>
        </Reveal>
        <div
          className={`testimonial-carousel ${styles.carousel}`}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          <span className="quotation-mark" aria-hidden="true">“</span>
          <motion.div
            className={`testimonial-content ${styles.viewport}`}
            id={contentId}
            aria-live="polite"
            aria-atomic="true"
            onPanEnd={onSwipe}
            data-testimonial-swipe="true"
          >
            {/* Reserve the tallest quote at every width so controls never jump. */}
            {testimonials.map((review) => (
              <div className={styles.sizingSlide} aria-hidden="true" key={review.name}>
                <p className={styles.quote}>{review.quote}</p>
                <div className={styles.starSpace} />
                <p className={styles.name}>{review.name}</p>
                <p className={styles.source}>A SWEET NOTE FROM OUR COMMUNITY</p>
              </div>
            ))}
            <AnimatePresence initial={false} custom={{ direction, reduced }}>
              <TestimonialSlide
                key={active}
                review={testimonials[active]}
                direction={direction}
                reduced={reduced}
              />
            </AnimatePresence>
          </motion.div>
          <div className={`testimonial-controls ${styles.controls}`}>
            <motion.button
              type="button"
              className={`circle-button ${styles.control} ${styles.previous}`}
              aria-label="Previous testimonial"
              aria-controls={contentId}
              onClick={() => navigate(-1)}
              whileTap={{ scale: reduced ? 1 : 0.95 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </motion.button>
            <div className={styles.controlCenter}>
              <div className={styles.counter} aria-hidden="true">
                <span className={styles.current}>{String(active + 1).padStart(2, "0")}</span>
                <span className={styles.counterRule} />
                <span>{String(testimonials.length).padStart(2, "0")}</span>
              </div>
              <div className={`testimonial-dots ${styles.dots}`}>
                {testimonials.map((review, index) => (
                  <button
                    key={review.name}
                    type="button"
                    aria-label={`Read testimonial by ${review.name}`}
                    aria-pressed={active === index}
                    aria-controls={contentId}
                    className={`${styles.dot} ${active === index ? "active" : ""}`}
                    onClick={() => {
                      if (index !== active) setSelection([index, index > active ? 1 : -1]);
                    }}
                  />
                ))}
              </div>
            </div>
            <motion.button
              type="button"
              className={`circle-button ${styles.control} ${styles.next}`}
              aria-label="Next testimonial"
              aria-controls={contentId}
              onClick={() => navigate(1)}
              whileTap={{ scale: reduced ? 1 : 0.95 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
