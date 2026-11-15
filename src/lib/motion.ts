/** Media queries shared by CSS (see globals.css `reel` variant) and GSAP matchMedia. */
export const MQ = {
  motionOk: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  /** Desktop storytelling layouts: wide screens where motion is welcome. */
  reel: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
  /** Narrow screens where motion is welcome. */
  compactMotion: "(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduced).matches;

/** Signature easing used across the site, expressed for GSAP. */
export const EASE = {
  reveal: "expo.out",
  wipe: "power3.inOut",
  drift: "sine.inOut",
} as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
