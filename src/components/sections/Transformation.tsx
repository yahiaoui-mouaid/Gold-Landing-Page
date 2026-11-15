"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { transformationCopy } from "@/content/copy";
import { photoAlt, photos } from "@/content/images";
import { formatIndex, stages } from "@/content/process";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { clamp01, MQ } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

const total = stages.length;
const stageAt = (value: number) => stages[Math.min(total - 1, Math.floor(value * total))];

/**
 * Before and after, as one continuous movement: dragging right advances
 * through the process, revealing the finished necklace over the raw gold.
 * The scale below the image names the stage that position corresponds to.
 */
export function Transformation() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0.08);
  const dragging = useRef(false);
  const touched = useRef(false);
  const hint = useRef<gsap.core.Tween | null>(null);

  const stop = () => {
    touched.current = true;
    hint.current?.kill();
  };

  const setFromPointer = useCallback((clientX: number) => {
    const rect = frame.current!.getBoundingClientRect();
    setValue(clamp01((clientX - rect.left) / rect.width));
  }, []);

  // A single hint when the comparison first comes into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        const state = { v: 0.08 };
        hint.current = gsap.to(state, {
          v: 0.52,
          duration: 2.2,
          ease: "power3.inOut",
          paused: true,
          onUpdate: () => {
            if (!touched.current) setValue(state.v);
          },
        });
        gsap.timeline({
          scrollTrigger: {
            trigger: frame.current,
            start: "top 70%",
            once: true,
            onEnter: () => {
              if (!touched.current) hint.current?.play();
            },
          },
        });
      });
      mm.add(MQ.reduced, () => setValue(0.5));
    },
    { scope: root },
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey || e.key === "PageUp" || e.key === "PageDown" ? 0.1 : 1 / total;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "PageUp") next = value + step;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "PageDown") next = value - step;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 1;
    if (next === null) return;
    e.preventDefault();
    stop();
    setValue(clamp01(next));
  };

  const current = stageAt(value);
  const percent = value * 100;

  return (
    <section
      id="transformation"
      ref={root}
      aria-labelledby="transformation-title"
      className="relative overflow-hidden bg-soot py-24 sm:py-32 lg:py-44"
    >
      <div className="shell">
        <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <SectionLabel>{transformationCopy.label}</SectionLabel>
            <h2 id="transformation-title" data-split="reveal" className="type-display mt-6 lg:mt-8">
              {transformationCopy.headline[0]}{" "}
              <br />
              {transformationCopy.headline[1]}
            </h2>
          </div>
          <p className="type-body max-w-[30rem] self-end text-ivory/70 lg:col-span-4 lg:col-start-9 lg:pb-3">
            {transformationCopy.body}
          </p>
        </div>

        <div className="mt-12 lg:mt-20">
          <div
            ref={frame}
            className="relative aspect-[4/5] cursor-ew-resize select-none overflow-hidden bg-ink [touch-action:pan-y] xs:aspect-[4/3] lg:aspect-[16/8.4]"
            onPointerDown={(e) => {
              stop();
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              setFromPointer(e.clientX);
              handle.current?.focus({ preventScroll: true });
            }}
            onPointerMove={(e) => {
              if (dragging.current) setFromPointer(e.clientX);
            }}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            {/* Raw gold underneath */}
            <Image
              src={photos.rawGold}
              alt={photoAlt.rawGold}
              fill
              quality={80}
              placeholder="blur"
              sizes="(min-width: 92rem) 84rem, 92vw"
              className="pointer-events-none object-cover object-[60%_50%]"
            />
            {/* Finished necklace, revealed from the left */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
            >
              <Image
                src={photos.hero}
                alt={photoAlt.hero}
                fill
                quality={80}
                sizes="(min-width: 92rem) 84rem, 92vw"
                className="pointer-events-none object-cover object-[50%_45%]"
              />
            </div>

            <span
              aria-hidden
              className={cn(
                "type-label absolute bottom-5 left-5 bg-ink/60 px-3 py-2 text-ivory backdrop-blur-sm transition-opacity duration-500 sm:bottom-7 sm:left-7",
                value < 0.12 && "opacity-0",
              )}
            >
              {transformationCopy.after}
            </span>
            <span
              aria-hidden
              className={cn(
                "type-label absolute bottom-5 right-5 bg-ink/60 px-3 py-2 text-ivory backdrop-blur-sm transition-opacity duration-500 sm:bottom-7 sm:right-7",
                value > 0.88 && "opacity-0",
              )}
            >
              {transformationCopy.before}
            </span>

            {/* Handle */}
            <div
              ref={handle}
              role="slider"
              tabIndex={0}
              aria-label={transformationCopy.sliderLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(percent)}
              aria-valuetext={`${Math.round(percent)}% finished, stage ${current.index} of ${total}: ${current.title}`}
              onKeyDown={onKeyDown}
              className="group absolute inset-y-0 -ml-6 flex w-12 justify-center outline-none"
              style={{ left: `${percent}%` }}
            >
              <span aria-hidden className="h-full w-px bg-champagne/90" />
              <span
                aria-hidden
                className="absolute top-1/2 flex size-14 -translate-y-1/2 items-center justify-center gap-1.5 rounded-full border border-champagne/80 bg-ink/55 text-champagne backdrop-blur-md transition-transform duration-500 ease-[var(--ease-cinematic)] group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-champagne group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-ink"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6L6 11" stroke="currentColor" />
                </svg>
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M1 1L6 6L1 11" stroke="currentColor" />
                </svg>
              </span>
            </div>
          </div>

          {/* Stage scale: one tick per stage, aligned under the image so the handle sits above its stage. */}
          <div className="mt-2">
            <div className="flex h-10 items-start" role="group" aria-label="Jump to a stage">
              {stages.map((stage, i) => {
                const reached = i <= Math.floor(value * total) && value > 0;
                const isCurrent = stage.index === current.index;
                return (
                  <button
                    key={stage.index}
                    type="button"
                    tabIndex={-1}
                    aria-label={`Stage ${stage.index}: ${stage.title}`}
                    onClick={() => {
                      stop();
                      setValue((i + 0.5) / total);
                    }}
                    className="group flex h-10 flex-1 items-start justify-center"
                  >
                    <span
                      className={cn(
                        "block w-px transition-all duration-300",
                        isCurrent ? "h-8 bg-gold" : reached ? "h-3 bg-ivory/60" : "h-3 bg-ivory/20",
                        "group-hover:h-6",
                      )}
                    />
                  </button>
                );
              })}
            </div>
            <p className="type-small mt-3 text-ivory" aria-hidden>
              <span className="tabular mr-3 text-champagne">{formatIndex(current.index)}</span>
              {current.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
