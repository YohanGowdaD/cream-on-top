"use client";

import Image, { type ImageProps } from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

type Props = Omit<ImageProps, "loading" | "fetchPriority" | "preload" | "priority" | "ref">;

/** Prioritize the initial viewport, including restored scroll and section links. */
export function ViewportImage(props: Props) {
  const image = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  const [important, setImportant] = useState(false);

  useLayoutEffect(() => {
    const element = image.current;
    if (!element) return;

    function check(initial = false) {
      const bounds = element!.getBoundingClientRect();
      const visible = bounds.bottom > 0 && bounds.top < innerHeight
        && bounds.right > 0 && bounds.left < innerWidth;
      if (visible) {
        setReady(true);
        if (initial) setImportant(true);
      }
    }

    // Browsers can restore the scroll position after hydration has started.
    check(true);
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      check(true);
      secondFrame = requestAnimationFrame(() => check(true));
    });
    const onPageShow = () => check(true);
    const onHashChange = () => check();
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("hashchange", onHashChange);

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px 0px" });
    observer.observe(element);

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      observer.disconnect();
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [props.src]);

  return <Image {...props} ref={image} loading={ready ? "eager" : "lazy"} fetchPriority={important ? "high" : "auto"} />;
}
