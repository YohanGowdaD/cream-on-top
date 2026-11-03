"use client";

import { useReducedMotionPreference } from "@/lib/useReducedMotionPreference";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandMark } from "./BrandMark";
import styles from "./Navbar.module.css";

const links = [
  { label: "Home", id: "home" },
  { label: "Our Story", id: "our-story" },
  { label: "Creations", id: "creations" },
  { label: "Testimonials", id: "testimonials" },
  { label: "Contact", id: "enquiry" },
] as const;

type NavigationSection = (typeof links)[number]["id"];

// Cake collections precede the founder story in the page's visual narrative.
const sectionGroups: Record<string, NavigationSection> = {
  home: "home",
  introduction: "home",
  collections: "creations",
  creations: "creations",
  "our-story": "our-story",
  testimonials: "testimonials",
  enquiry: "enquiry",
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavigationSection>("home");
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 190,
    damping: 34,
    restDelta: 0.001,
  });

  useEffect(() => {
    let frame = 0;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]"),
    ).filter((section) => sectionGroups[section.id]);

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 28);
      const headerHeight = header.current?.offsetHeight ?? 100;
      const readingLine = headerHeight + Math.min(window.innerHeight * 0.18, 150);
      let current: NavigationSection = "home";

      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingLine) break;
        current = sectionGroups[section.id];
      }

      setActiveSection(current);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const bodyPadding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${bodyPadding + scrollbarWidth}px`;
    }

    const focusFrame = requestAnimationFrame(() => {
      menu.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }

      if (event.key === "Tab") {
        const items = [
          toggle.current,
          ...Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []),
        ].filter((item): item is HTMLButtonElement | HTMLAnchorElement => Boolean(item));
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      if (window.innerWidth >= 1024) {
        header.current
          ?.querySelector<HTMLAnchorElement>('.desktop-nav a[aria-current="location"]')
          ?.focus({ preventScroll: true });
      } else {
        toggle.current?.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const linkVariants: Variants = {
    closed: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 13 },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const menuVariants: Variants = {
    closed: {
      opacity: reducedMotion ? 1 : 0,
      height: reducedMotion ? "auto" : 0,
      transition: { duration: reducedMotion ? 0 : 0.2 },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: reducedMotion ? 0 : 0.34,
        ease: [0.22, 1, 0.36, 1],
        delayChildren: reducedMotion ? 0 : 0.06,
        staggerChildren: reducedMotion ? 0 : 0.045,
      },
    },
  };

  return (
    <header
      ref={header}
      className={`site-header ${styles.header}${scrolled ? " scrolled" : ""}${open ? " menu-open" : ""}`}
    >
      <div className="nav-wrap">
        <BrandMark />
        <nav className={`desktop-nav ${styles.desktop}`} aria-label="Main navigation">
          {links.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              className={styles.navLink}
              aria-current={activeSection === id ? "location" : undefined}
            >
              {label}
              {activeSection === id && (
                <motion.span
                  className={styles.activeLine}
                  layoutId={reducedMotion ? undefined : "active-navigation-line"}
                  initial={false}
                  transition={reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 330, damping: 33 }}
                  aria-hidden="true"
                />
              )}
            </a>
          ))}
        </nav>
        <a href="#enquiry" className={`nav-cta ${styles.createLink}`}>
          Create Your Cake <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <button
          ref={toggle}
          className={`menu-toggle ${styles.menuToggle}`}
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            ref={menu}
            id="mobile-navigation"
            className={`mobile-navigation ${styles.mobileMenu}`}
            variants={menuVariants}
            initial={reducedMotion ? false : "closed"}
            animate="open"
            exit="closed"
          >
            <nav aria-label="Mobile navigation">
              {links.map(({ label, id }, index) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  variants={linkVariants}
                  className={styles.mobileLink}
                  aria-current={activeSection === id ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span aria-hidden="true">0{index + 1}</span>
                  {label}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </motion.a>
              ))}
              <motion.a
                className={`mobile-create ${styles.mobileCreate}`}
                href="#enquiry"
                variants={linkVariants}
                onClick={() => setOpen(false)}
              >
                Create Your Cake <ArrowUpRight size={18} aria-hidden="true" />
              </motion.a>
            </nav>
            <motion.p variants={linkVariants}>
              Handcrafted in Bangalore. Made for you.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.progressTrack} aria-hidden="true">
        <motion.div
          className={styles.progress}
          data-scroll-progress
          style={{ scaleX: reducedMotion ? scrollYProgress : smoothProgress }}
        />
      </div>
    </header>
  );
}
