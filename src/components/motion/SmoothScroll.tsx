"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger and the
 * scroll position always agree. Disabled entirely for reduced motion.
 * Also owns in-page anchor navigation, including moving keyboard focus.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      autoRaf: false,
    });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Layout can shift once web fonts finish loading; re-measure triggers then.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // Delegate same-page anchor clicks.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      scrollToElement(target, lenis);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

function scrollToElement(target: HTMLElement, lenis: Lenis | null) {
  const focusTarget = () => {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  const hash = target.id === "top" ? " " : `#${target.id}`;
  history.replaceState(null, "", hash === " " ? window.location.pathname : hash);

  if (lenis) {
    // A link inside the (scroll-locking) mobile menu may trigger this.
    document.documentElement.style.overflow = "";
    lenis.start();
    lenis.scrollTo(target, {
      force: true,
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      onComplete: focusTarget,
    });
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    focusTarget();
  }
}

export const useLenis = () => useContext(LenisContext);

/** Imperative scroll helper that works with or without Lenis. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (y: number) => {
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    },
    [lenis],
  );
}
