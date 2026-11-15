"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { EASE, MQ } from "@/lib/motion";

/**
 * Declarative scroll effects for server-rendered markup.
 *
 * Sections stay server components and opt in with data attributes:
 *   data-split="reveal"     headline lines rise through a mask
 *   data-rule               hairline draws from the left
 *   data-parallax="<n>"     drifts ±n% while its parent crosses the viewport
 *   data-reveal="frame"     image frame wipes open, child [data-reveal-media] settles
 *   data-reveal-compact     (with data-reveal) only on narrow screens
 *
 * Mounted once, after every section, so it measures the final layout.
 */
export function ScrollEffects() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.reduced, () => {
      gsap.set('[data-split="reveal"]', { visibility: "visible" });
    });

    mm.add(
      { motion: MQ.motionOk, compact: MQ.compactMotion },
      (context) => {
        const { motion, compact } = context.conditions as { motion: boolean; compact: boolean };
        if (!motion) return;

        let cancelled = false;
        const splits: SplitText[] = [];

        // Headlines: wait for fonts so line breaks are measured correctly.
        // Named add() returns a wrapper that records animations when called later.
        const revealHeadlines = context.add("revealHeadlines", () => {
          if (cancelled) return;
          gsap.utils.toArray<HTMLElement>('[data-split="reveal"]').forEach((el) => {
            const split = SplitText.create(el, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
            });
            splits.push(split);
            gsap.set(el, { visibility: "visible" });
            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1.3,
              ease: EASE.reveal,
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              // Restore natural text so it reflows freely on resize.
              onComplete: () => split.revert(),
            });
          });
          ScrollTrigger.refresh();
        });
        document.fonts.ready.then(() => revealHeadlines());

        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            duration: 1.6,
            ease: EASE.wipe,
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 8;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="frame"]').forEach((frame) => {
          if ("revealCompact" in frame.dataset && !compact) return;
          const media = frame.querySelector<HTMLElement>("[data-reveal-media]");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: frame, start: "top 85%", once: true },
          });
          tl.fromTo(
            frame,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EASE.wipe },
          );
          if (media) {
            tl.fromTo(media, { scale: 1.22 }, { scale: 1, duration: 2, ease: EASE.reveal }, 0);
          }
        });

        return () => {
          cancelled = true;
          splits.forEach((s) => s.revert());
        };
      },
    );
  });

  return null;
}
