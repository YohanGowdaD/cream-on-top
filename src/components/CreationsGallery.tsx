"use client";

import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";

import Image from "next/image";
import { ViewportImage } from "./ViewportImage";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { cakeCategories, cakes, type CakeCategory } from "@/data/cakes";
import styles from "./CreationsGallery.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type ImageMotion = { direction: number; reduced: boolean };

const imageVariants: Variants = {
  enter: ({ direction, reduced }: ImageMotion) => ({
    opacity: reduced ? 1 : 0,
    x: reduced ? 0 : direction * 44,
    scale: reduced ? 1 : 0.99,
  }),
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: ({ direction, reduced }: ImageMotion) => ({
    opacity: 0,
    x: reduced ? 0 : direction * -28,
    scale: reduced ? 1 : 0.995,
  }),
};

function isCategory(value: unknown): value is CakeCategory {
  return cakeCategories.some((category) => category.id === value);
}

export function CreationsGallery() {
  const [category, setCategory] = useState<CakeCategory>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [imageDirection, setImageDirection] = useState(0);
  const reducedMotion = useReducedMotionPreference();
  const filterGroupId = useId();
  const dialogTitleId = useId();
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const visibleCakes = useMemo(
    () => cakes.filter((cake) => category === "all" || cake.category === category),
    [category],
  );
  const activeIndex = visibleCakes.findIndex((cake) => cake.id === activeId);
  const activeCake = visibleCakes[activeIndex];
  const lightboxOpen = activeIndex >= 0;

  const navigate = useCallback(
    (direction: number) => {
      if (visibleCakes.length < 2) return;
      setImageDirection(direction);
      setActiveId((current) => {
        const currentIndex = visibleCakes.findIndex((cake) => cake.id === current);
        const nextIndex =
          (currentIndex + direction + visibleCakes.length) % visibleCakes.length;
        return visibleCakes[nextIndex]?.id ?? null;
      });
    },
    [visibleCakes],
  );

  function onImageSwipe(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if ("pointerType" in event && event.pointerType === "mouse") return;
    const distance = Math.abs(info.offset.x);
    const intentionalSwipe =
      distance > Math.abs(info.offset.y) * 1.35 &&
      (distance > 55 || (distance > 28 && Math.abs(info.velocity.x) > 450));
    if (intentionalSwipe) navigate(info.offset.x < 0 ? 1 : -1);
  }

  useEffect(() => {
    function chooseCategory(value: unknown) {
      if (isCategory(value)) {
        setActiveId(null);
        setCategory(value);
      }
    }
    function onCategory(event: Event) {
      chooseCategory((event as CustomEvent<string>).detail);
    }
    function onHashChange() {
      const [anchor, query] = window.location.hash.slice(1).split("?");
      if (anchor === "creations" && query) {
        chooseCategory(new URLSearchParams(query).get("category"));
      }
    }
    window.addEventListener("cake-category", onCategory);
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => {
      window.removeEventListener("cake-category", onCategory);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const returnFocus = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const currentPadding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    const focusFrame = requestAnimationFrame(() => closeButton.current?.focus());
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveId(null);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigate(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigate(-1);
      }
      if (event.key === "Tab") {
        const focusable = dialog.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex="0"]',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
      window.removeEventListener("keydown", onKeyDown);
      returnFocus?.focus({ preventScroll: true });
    };
  }, [lightboxOpen, navigate]);

  return (
    <section className={styles.section} id="creations" aria-labelledby="creations-heading">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, ease: EASE }}
        >
          <p className="eyebrow">THE ART OF CELEBRATION</p>
          <h2 className="section-heading" id="creations-heading">
            A Gallery of <em>Sweet Moments</em>
          </h2>
          <p className="section-intro">
            AI-generated cake inspiration. Explore a direction, then create your own with Neha.
          </p>
        </motion.div>

        <LayoutGroup id={filterGroupId}>
          <div className={styles.filters} role="group" aria-label="Filter cake creations">
            {cakeCategories.map((item) => (
              <button
                className={`${styles.filter} ${category === item.id ? styles.selected : ""}`}
                key={item.id}
                type="button"
                aria-pressed={category === item.id}
                onClick={() => {
                  setActiveId(null);
                  setCategory(item.id);
                }}
              >
                {item.label}
                {category === item.id && (
                  <motion.span
                    className={styles.filterIndicator}
                    layoutId="active-category"
                    aria-hidden="true"
                    transition={{ duration: reducedMotion ? 0 : 0.42, ease: EASE }}
                  />
                )}
              </button>
            ))}
          </div>
        </LayoutGroup>

        <p className={styles.resultCount} aria-live="polite" aria-atomic="true">
          {category === "all"
            ? "Twelve ideas for your next celebration"
            : `${visibleCakes.length} ${visibleCakes.length === 1 ? "creation" : "creations"} to inspire your celebration`}
        </p>

        <div className={styles.grid}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleCakes.map((cake, index) => (
              <motion.article
                className={`${styles.card} ${styles[cake.ratio]}`}
                key={cake.id}
                layout={reducedMotion ? false : "position"}
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.18 } }}
                whileHover={{
                  y: reducedMotion ? 0 : -4,
                  transition: { duration: reducedMotion ? 0 : 0.35, delay: 0, ease: EASE },
                }}
                transition={{
                  layout: { duration: reducedMotion ? 0 : 0.48, ease: EASE },
                  opacity: { duration: reducedMotion ? 0 : 0.28 },
                  y: {
                    duration: reducedMotion ? 0 : 0.48,
                    delay: reducedMotion ? 0 : Math.min(index, 5) * 0.035,
                    ease: EASE,
                  },
                }}
              >
                <button
                  className={styles.imageButton}
                  type="button"
                  onClick={() => {
                    setImageDirection(0);
                    setActiveId(cake.id);
                  }}
                  aria-label={`View ${cake.title} in full screen`}
                >
                  <ViewportImage
                    src={cake.image}
                    alt={cake.alt}
                    fill
                    quality={90}
                    sizes="(max-width: 460px) calc(100vw - 44px), (max-width: 700px) calc((100vw - 56px) / 2), (max-width: 1000px) calc((100vw - 102px) / 3), (max-width: 1280px) calc((100vw - 168px) / 3), 371px"
                    style={{ objectPosition: cake.position ?? "center" }}
                  />
                  <span className={styles.imageShade} />
                  <span className={styles.expand} aria-hidden="true">
                    <Expand size={18} strokeWidth={1.4} />
                  </span>
                  <span className={styles.imageCaption}>
                    <span>{cake.subtitle}</span>
                    <strong>{cake.title}</strong>
                  </span>
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <div className={styles.bottomLine}>
          <p>Something caught your eye? Let&apos;s make it your own.</p>
          <a className={styles.enquiryLink} href="#enquiry">
            Dream up your cake <ArrowDownRight size={18} strokeWidth={1.4} />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {activeCake && (
          <motion.div
            className={styles.lightboxBackdrop}
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: EASE }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setActiveId(null);
            }}
          >
            <motion.div
              className={styles.lightbox}
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              initial={reducedMotion ? false : { y: 18, scale: 0.985 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: reducedMotion ? 0 : 10, scale: reducedMotion ? 1 : 0.99 }}
              transition={{ duration: reducedMotion ? 0 : 0.38, ease: EASE }}
            >
              <div className={styles.lightboxTop}>
                <span>CREAM ON TOP <i>by Neha Gupta</i></span>
                <button
                  className={styles.close}
                  type="button"
                  aria-label="Close image gallery"
                  onClick={() => setActiveId(null)}
                  ref={closeButton}
                >
                  <X size={23} strokeWidth={1.5} />
                </button>
              </div>
              <motion.div
                className={styles.lightboxImage}
                onPanEnd={onImageSwipe}
                data-gallery-swipe="true"
              >
                <AnimatePresence
                  initial={false}
                  custom={{ direction: imageDirection, reduced: Boolean(reducedMotion) }}
                >
                  <motion.div
                    key={activeCake.id}
                    className={styles.lightboxImageInner}
                    custom={{ direction: imageDirection, reduced: Boolean(reducedMotion) }}
                    variants={imageVariants}
                    initial="enter"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: reducedMotion ? 0 : 0.42, ease: EASE }}
                  >
                    <Image
                      src={activeCake.image}
                      alt={activeCake.alt}
                      fill
                      quality={90}
                      sizes="(max-width: 600px) 94vw, 80vw"
                      className={styles.fullImage}
                      draggable={false}
                      loading="eager"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <div className={styles.lightboxBottom}>
                <div className={styles.lightboxDescription} aria-live="polite" aria-atomic="true">
                  <p>AI-generated design inspiration</p>
                  <h3 id={dialogTitleId}>{activeCake.title}</h3>
                  {visibleCakes.length > 1 && (
                    <span className={styles.swipeHint} aria-hidden="true">Swipe to explore</span>
                  )}
                </div>
                <div className={styles.lightboxNavigation}>
                  <span className={styles.imageCount}>
                    {String(activeIndex + 1).padStart(2, "0")} / {String(visibleCakes.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="Previous cake image"
                    disabled={visibleCakes.length < 2}
                  >
                    <ArrowLeft size={21} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(1)}
                    aria-label="Next cake image"
                    disabled={visibleCakes.length < 2}
                  >
                    <ArrowRight size={21} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
