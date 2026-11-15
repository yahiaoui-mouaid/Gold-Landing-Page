"use client";

import Image from "next/image";
import { useRef } from "react";
import { heroCopy } from "@/content/copy";
import { photoAlt, photos } from "@/content/images";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ, prefersReducedMotion } from "@/lib/motion";
import { Wordmark } from "@/components/ui/Wordmark";

/** Longest the intro will wait for the hero photograph before revealing anyway. */
const IMAGE_WAIT_MS = 1800;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const imageReady = useRef(false);
  const release = useRef<(() => void) | null>(null);

  const markImageReady = () => {
    imageReady.current = true;
    release.current?.();
  };

  useGSAP(
    () => {
      const html = document.documentElement;
      const title = root.current!.querySelector<HTMLElement>("#hero-title")!;
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", root.current);
      const intros = gsap.utils.toArray<HTMLElement>("[data-intro]");
      const veil = curtain.current!;
      gsap.set(title, { visibility: "visible" });
      // Script is running, so the no-JS safety timer in <head> is no longer needed.
      window.clearTimeout(window.__introFailsafe);

      // ---- Entrance: one orchestrated sequence, only on first paint. ----
      const playIntro = !prefersReducedMotion() && html.classList.contains("intro-pending");
      if (playIntro) {
        gsap.set(lines, { yPercent: 115 });
        gsap.set(intros, { opacity: 0, y: 18 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => html.classList.remove("intro-pending"),
        });
        tl.fromTo(
          veil.querySelector("[data-curtain-mark]"),
          { yPercent: 115 },
          { yPercent: 0, duration: 1.1 },
        )
          .fromTo(
            veil.querySelector("[data-curtain-line]"),
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, ease: "power2.inOut" },
            0.15,
          )
          .addLabel("reveal", 1.25)
          // Hold here until the photograph has decoded (bounded by IMAGE_WAIT_MS).
          .add(() => {
            if (!imageReady.current) {
              tl.pause();
              release.current = () => {
                release.current = null;
                tl.play();
              };
            }
          }, "reveal")
          .to(
            veil.querySelector("[data-curtain-inner]"),
            { yPercent: -40, autoAlpha: 0, duration: 0.8, ease: "power3.in" },
            "reveal",
          )
          .to(veil, { yPercent: -100, duration: 1.2, ease: "power4.inOut" }, "reveal+=0.3")
          .fromTo("[data-hero-image]", { scale: 1.2 }, { scale: 1, duration: 2.6 }, "reveal+=0.55")
          .to(lines, { yPercent: 0, duration: 1.5, stagger: 0.12 }, "reveal+=0.85")
          .to(intros, { opacity: 1, y: 0, duration: 1.2, stagger: 0.09 }, "reveal+=1.25");

        const timer = window.setTimeout(markImageReady, IMAGE_WAIT_MS);
        return () => window.clearTimeout(timer);
      }

      html.classList.remove("intro-pending");
    },
    { scope: root },
  );

  // ---- Scroll-out and pointer drift (motion only). ----
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        gsap.to("[data-hero-image]", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: -12,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "40% top", end: "bottom top", scrub: true },
        });
      });

      mm.add(`${MQ.motionOk} and ${MQ.finePointer}`, () => {
        const drift = root.current!.querySelector<HTMLElement>("[data-hero-drift]")!;
        const toX = gsap.quickTo(drift, "x", { duration: 1.6, ease: "power3.out" });
        const toY = gsap.quickTo(drift, "y", { duration: 1.6, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          toX(nx * -22);
          toY(ny * -14);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <>
    {/* Intro curtain: displayed only while <html> has .intro-pending (see layout). */}
    <div
      ref={curtain}
      aria-hidden
      className="intro-curtain fixed inset-0 z-[70] items-center justify-center bg-ink"
    >
      <div data-curtain-inner className="flex flex-col items-center gap-6">
        <div className="overflow-hidden px-2 pb-1">
          <div data-curtain-mark>
            <Wordmark className="text-[clamp(2.75rem,7vw,5rem)]" />
          </div>
        </div>
        <span data-curtain-line className="block h-px w-40 origin-left bg-gold/70" />
      </div>
    </div>

    <section
      id="top"
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink"
    >

      {/* Photograph: right-hand field on desktop, top field on small screens. */}
      <div className="hero-visual absolute inset-x-0 top-0 -z-10 h-[66svh] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[64%]">
        <div data-hero-drift className="absolute -inset-6">
          <div data-hero-image className="absolute inset-0 will-change-transform">
            <Image
              src={photos.hero}
              alt={photoAlt.hero}
              fill
              preload
              quality={90}
              placeholder="blur"
              sizes="(min-width: 64rem) 66vw, 100vw"
              className="object-cover object-[50%_42%] lg:object-[38%_50%]"
              onLoad={markImageReady}
            />
          </div>
        </div>
      </div>

      <div
        data-hero-copy
        className="shell relative flex min-h-[100svh] flex-col justify-end pb-10 pt-[50svh] sm:pb-14 lg:justify-center lg:pb-20 lg:pt-28"
      >
        <h1
          id="hero-title"
          data-split="manual"
          className="type-hero text-[clamp(2.6rem,10.6vw,5rem)] text-ivory lg:text-[clamp(4.4rem,6.5vw,8.75rem)]"
        >
          {heroCopy.headline.map((line, i) => (
            <span key={line} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
              <span data-line className={cn("block", i === 1 && "pl-[0.6em] lg:pl-[1.1em]")}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-7 grid gap-7 sm:mt-10 lg:mt-12 lg:max-w-[33rem]">
          <p data-intro className="type-body max-w-[31rem] text-ivory/75 lg:text-[1.125rem]">
            {heroCopy.intro}
          </p>
          <div data-intro className="flex flex-wrap gap-3">
            <a href={heroCopy.primaryCta.href} className="btn-gold">
              {heroCopy.primaryCta.label}
            </a>
            <a href={heroCopy.secondaryCta.href} className="btn-ghost text-ivory">
              {heroCopy.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      <div
        data-intro
        aria-hidden
        className="absolute bottom-8 right-[clamp(1.25rem,4.2vw,4rem)] hidden items-center gap-4 text-ivory/55 lg:flex"
      >
        <span className="type-label">{heroCopy.caption}</span>
        <span className="h-px w-16 bg-current" />
      </div>
    </section>
    </>
  );
}
