"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { processCopy } from "@/content/copy";
import { photoAlt, photos } from "@/content/images";
import { chapters, formatIndex, stages } from "@/content/process";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { Hallmark } from "@/components/ui/Hallmark";

/** Timeline units: the wipe between two stages, and the rest on each stage. */
const MOVE = 1;
const HOLD = 0.75;
/** Scroll distance given to each stage on desktop, in viewport heights. */
const SCROLL_PER_STAGE = 85;

const total = stages.length;
const chapterName = (id: string) => chapters.find((c) => c.id === id)?.name ?? "";

/**
 * The twelve-stage manufacturing story.
 *
 * Desktop (with motion): a sticky, scroll-scrubbed reel. Each photograph wipes
 * in over the previous one, which drifts and dims beneath it; chapter changes
 * open from the centre instead of from below. A rolling counter and a rail
 * of hallmark ticks show where you are, and the rail is clickable.
 *
 * Small screens or reduced motion: the same markup flows as a vertical sequence.
 */
export function ProcessReel() {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.reel, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-stage]");
        const pick = (sel: string) => items.map((li) => li.querySelector<HTMLElement>(sel)!);
        const media = pick("[data-stage-media]");
        const images = pick("[data-stage-image]");
        const shades = pick("[data-stage-shade]");
        const texts = pick("[data-stage-text]");

        gsap.set(media.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(texts.slice(1), { opacity: 0, y: 48 });

        const tl = gsap.timeline({ defaults: { ease: "none" } });
        tl.fromTo("[data-reel-progress]", { scaleX: 0 }, { scaleX: 1, duration: (total - 1) * (MOVE + HOLD) }, 0);

        for (let i = 1; i < total; i++) {
          const at = HOLD / 2 + (i - 1) * (MOVE + HOLD);
          const newChapter = stages[i].chapter !== stages[i - 1].chapter;
          tl.fromTo(
            media[i],
            { clipPath: newChapter ? "inset(50% 50% 50% 50%)" : "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: MOVE, ease: "power2.inOut" },
            at,
          )
            .fromTo(
              images[i],
              { scale: 1.28, yPercent: 5 },
              { scale: 1, yPercent: 0, duration: MOVE, ease: "power2.out" },
              at,
            )
            .to(images[i - 1], { scale: 1.08, yPercent: -4, duration: MOVE, ease: "power1.in" }, at)
            .to(shades[i - 1], { opacity: 0.7, duration: MOVE }, at)
            .to(texts[i - 1], { opacity: 0, y: -48, duration: MOVE * 0.45, ease: "power2.in" }, at)
            .fromTo(
              texts[i],
              { opacity: 0, y: 48 },
              { opacity: 1, y: 0, duration: MOVE * 0.5, ease: "power2.out" },
              at + MOVE * 0.5,
            )
            .to(
              "[data-counter-units]",
              { yPercent: (-100 * i) / total, duration: MOVE * 0.6, ease: "power3.inOut" },
              at + MOVE * 0.2,
            );
          if (i === 9) {
            tl.to("[data-counter-tens]", { yPercent: -50, duration: MOVE * 0.6, ease: "power3.inOut" }, at + MOVE * 0.2);
          }
        }

        trigger.current = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          animation: tl,
          scrub: 0.6,
          // Settle on the nearest stage, never fling past several at once.
          snap: {
            snapTo: 1 / (total - 1),
            inertia: false,
            duration: { min: 0.3, max: 0.8 },
            delay: 0.2,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const index = Math.round(self.progress * (total - 1));
            setActive((prev) => (prev === index ? prev : index));
          },
        });

        return () => {
          trigger.current = null;
          setActive(0);
        };
      });
    },
    { scope: root },
  );

  const goTo = (index: number) => {
    const st = trigger.current;
    if (!st) return;
    scrollTo(st.start + (index / (total - 1)) * (st.end - st.start));
  };

  return (
    <div
      ref={root}
      className="relative reel:h-[var(--reel-height)]"
      style={{ "--reel-height": `${(total - 1) * SCROLL_PER_STAGE + 100}vh` } as React.CSSProperties}
    >
      <div className="reel:sticky reel:top-0 reel:h-[100svh] reel:overflow-hidden">
        <div className="shell reel:h-full">
        <div className="relative reel:h-full">
          {/* Rolling stage counter (desktop reel only; each stage also states its number). */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-[13svh] hidden items-start reel:flex"
          >
            <span className="font-display flex h-[1em] items-start overflow-hidden text-[clamp(6.5rem,19vh,12.5rem)] leading-none tracking-[-0.04em] text-ivory [font-variation-settings:'opsz'_96]">
              <span data-counter-tens className="flex flex-col">
                <span className="h-[1em]">0</span>
                <span className="h-[1em]">1</span>
              </span>
              <span data-counter-units className="flex flex-col">
                {stages.map((s) => (
                  <span key={s.index} className="h-[1em]">
                    {s.index % 10}
                  </span>
                ))}
              </span>
            </span>
            <span className="type-label tabular mt-4 pl-3 text-ivory/50">/ {total}</span>
          </div>

          <ol className="relative reel:h-full">
            {stages.map((stage) => (
              <li
                key={stage.index}
                data-stage
                className="relative grid gap-7 py-10 first:pt-2 sm:gap-8 sm:py-14 md:grid-cols-12 md:items-end md:gap-x-8 reel:absolute reel:inset-0 reel:items-center reel:py-0 reel:first:pt-0"
              >
                <figure
                  data-stage-media
                  data-reveal="frame"
                  data-reveal-compact
                  className="relative aspect-[4/5] overflow-hidden bg-soot xs:aspect-[4/3] md:col-span-7 md:aspect-[4/3] reel:col-span-7 reel:col-start-6 reel:row-start-1 reel:aspect-auto reel:h-[74svh]"
                >
                  <div data-stage-image data-reveal-media className="absolute inset-0 will-change-transform">
                    <Image
                      src={photos[stage.photo]}
                      alt={photoAlt[stage.photo]}
                      fill
                      quality={80}
                      placeholder="blur"
                      sizes="(min-width: 64rem) 56vw, (min-width: 48rem) 58vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: stage.focus }}
                    />
                  </div>
                  <div data-stage-shade aria-hidden className="absolute inset-0 bg-ink opacity-0" />
                </figure>

                <div
                  data-stage-text
                  className="md:col-span-5 md:pb-2 reel:col-span-4 reel:col-start-1 reel:row-start-1 reel:self-end reel:pb-[17svh]"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Hallmark value={formatIndex(stage.index)} className="text-gold reel:hidden" />
                    <span className="type-label text-ivory/55">{chapterName(stage.chapter)}</span>
                    {stage.signature && (
                      <span className="type-label border border-gold/50 px-2.5 py-1 text-gold">
                        {processCopy.signatureNote}
                      </span>
                    )}
                  </div>
                  <h3 className="type-heading mt-5 text-ivory">
                    <span className="sr-only">
                      Stage {stage.index} of {total}:{" "}
                    </span>
                    {stage.title}
                  </h3>
                  <p className="type-body mt-4 max-w-[27rem] text-ivory/70">{stage.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Rail: chapters with one tick per stage. */}
          <nav
            aria-label="Process stages"
            className="absolute bottom-[5svh] left-0 hidden reel:flex reel:gap-7"
          >
            {chapters.map((chapter) => {
              const chapterStages = stages.filter((s) => s.chapter === chapter.id);
              const current = stages[active].chapter === chapter.id;
              return (
                <div key={chapter.id} className="flex flex-col gap-2.5">
                  <div className="flex items-end gap-0.5">
                    {chapterStages.map((s) => {
                      const index = s.index - 1;
                      const isActive = index === active;
                      return (
                        <button
                          key={s.index}
                          type="button"
                          onClick={() => goTo(index)}
                          aria-label={`Stage ${s.index}: ${s.title}`}
                          aria-current={isActive ? "step" : undefined}
                          className="group flex h-9 w-3.5 items-end justify-center"
                        >
                          <span
                            className={cn(
                              "block w-px transition-all duration-500 ease-[var(--ease-cinematic)]",
                              isActive
                                ? "h-8 bg-gold"
                                : index < active
                                  ? "h-3.5 bg-ivory/60 group-hover:h-5"
                                  : "h-3.5 bg-ivory/25 group-hover:h-5 group-hover:bg-ivory/60",
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span
                    className={cn(
                      "type-label whitespace-nowrap transition-colors duration-500",
                      current ? "text-champagne" : "text-ivory/55",
                    )}
                  >
                    {chapter.name}
                  </span>
                </div>
              );
            })}
          </nav>

          {/* Overall progress, under the photograph frame (same grid as the stages). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden grid-cols-12 items-center gap-x-8 reel:grid"
          >
            <div className="relative col-span-7 col-start-6 h-[74svh]">
              <div className="absolute inset-x-0 -bottom-5 h-px bg-ivory/12">
                <span data-reel-progress className="absolute inset-0 block origin-left bg-gold" />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
