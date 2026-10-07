"use client";

import { useEffect } from "react";

// Loads the motion engine (GSAP, ScrollTrigger, SplitText, Lenis) only after
// hydration, as its own chunk. Without JS, every element is simply visible.
export default function ClientEffects() {
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    // Wait for the browser to be idle after load, so motion setup never
    // competes with first paint or hydration.
    const start = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      ric(
        () => {
          import("@/lib/motion").then(async ({ initMotion }) => {
            if (cancelled) return;
            dispose = await initMotion();
            if (cancelled) dispose?.();
          });
        },
        { timeout: 1500 },
      );
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      dispose?.();
    };
  }, []);
  return null;
}
