"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { braidCopy } from "@/content/copy";
import { photoAlt, photos } from "@/content/images";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MQ, prefersReducedMotion } from "@/lib/motion";
import { Hallmark } from "@/components/ui/Hallmark";
import type { BraidScene } from "./braidScene";

type Status = "idle" | "loading" | "ready" | "fallback";

/** Scroll progress at which each explanatory step becomes current. */
const STEP_AT = [0, 0.2, 0.45, 0.72];
const stepFor = (p: number) => STEP_AT.reduce((acc, at, i) => (p >= at ? i : acc), 0);

const { anatomy } = braidCopy;

/**
 * "How a braid comes together": a WebGL model of three ribbons of fine gold
 * wire that braid as the reader scrolls, beside the four steps it illustrates.
 * Three.js is loaded only when this section approaches the viewport, and the
 * render loop pauses whenever the canvas is off-screen.
 */
export function BraidAnatomy() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BraidScene | null>(null);
  const progressRef = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [step, setStep] = useState(0);

  useEffect(() => {
    const section = root.current!;
    const canvas = canvasRef.current!;
    let disposed = false;
    let scene: BraidScene | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let visibility: IntersectionObserver | null = null;

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setStatus("fallback");
    };

    const load = async () => {
      setStatus("loading");
      try {
        const mod = await import("./braidScene");
        if (disposed) return;
        if (!mod.canUseWebGL()) throw new Error("WebGL unavailable");
        scene = new mod.BraidScene(canvas, {
          reducedMotion: prefersReducedMotion(),
          quality: window.matchMedia("(min-width: 64rem)").matches ? "high" : "low",
        });
        sceneRef.current = scene;
        scene.setProgress(progressRef.current);

        resizeObserver = new ResizeObserver(([entry]) => {
          scene?.resize(entry.contentRect.width, entry.contentRect.height);
        });
        resizeObserver.observe(canvas);
        visibility = new IntersectionObserver(([entry]) => scene?.setActive(entry.isIntersecting));
        visibility.observe(canvas);
        canvas.addEventListener("webglcontextlost", onContextLost);
        setStatus("ready");
      } catch {
        if (!disposed) setStatus("fallback");
      }
    };

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        void load();
      },
      { rootMargin: "120% 0px" },
    );
    near.observe(section);

    return () => {
      disposed = true;
      near.disconnect();
      resizeObserver?.disconnect();
      visibility?.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      scene?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            progressRef.current = self.progress;
            sceneRef.current?.setProgress(self.progress);
            const next = stepFor(self.progress);
            setStep((prev) => (prev === next ? prev : next));
          },
        });
      });

      mm.add(`${MQ.motionOk} and ${MQ.finePointer}`, () => {
        const el = root.current!;
        const onMove = (e: PointerEvent) => {
          sceneRef.current?.setPointer(
            (e.clientX / window.innerWidth) * 2 - 1,
            (e.clientY / window.innerHeight) * 2 - 1,
          );
        };
        el.addEventListener("pointermove", onMove, { passive: true });
        return () => el.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative motion-safe:h-[340vh]">
      <div className="motion-safe:sticky motion-safe:top-0 motion-safe:h-[100svh] motion-safe:overflow-hidden">
        <div className="shell grid h-full gap-8 py-20 motion-safe:grid-rows-[minmax(0,1fr)_auto] motion-safe:pb-10 motion-safe:pt-20 lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:motion-safe:grid-rows-1 lg:motion-safe:py-0">
          {/* The model */}
          {/* Bleeds to the screen edge; the inner edge fades so the wires never end on a hard line. */}
          <div className="relative -mx-[clamp(1.25rem,4.2vw,4rem)] min-h-[18rem] motion-reduce:aspect-[4/3] lg:order-2 lg:col-span-8 lg:ml-0 lg:h-[82svh] lg:motion-reduce:h-auto">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Model of three ribbons of fine gold wire being braided together."
              className={cn(
                "braid-canvas absolute inset-0 h-full w-full transition-opacity duration-1000",
                status === "ready" ? "opacity-100" : "opacity-0",
                status === "fallback" && "hidden",
              )}
            />
            {(status === "idle" || status === "loading") && (
              <div className="absolute inset-0 flex items-center justify-center" role="status">
                <span className="type-label flex items-center gap-3 text-ivory/50">
                  <span className="relative block h-px w-12 overflow-hidden bg-ivory/15">
                    <span className="absolute inset-y-0 left-0 w-1/2 animate-[loading-bar_1.4s_ease-in-out_infinite] bg-gold" />
                  </span>
                  {anatomy.loading}
                </span>
              </div>
            )}
            {status === "fallback" && (
              <figure className="absolute inset-0 flex flex-col">
                <div className="relative flex-1 overflow-hidden">
                  <Image
                    src={photos.macro}
                    alt={photoAlt.macro}
                    fill
                    quality={80}
                    sizes="(min-width: 64rem) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="type-small mt-3 text-ivory/60">{anatomy.fallback}</figcaption>
              </figure>
            )}
          </div>

          {/* The steps it illustrates */}
          <div className="lg:order-1 lg:col-span-4">
            <h3 className="type-title text-ivory">{anatomy.title}</h3>
            <ol className="mt-6 grid lg:mt-10 lg:gap-0">
              {anatomy.steps.map((item, i) => {
                const isActive = i === step;
                return (
                  <li
                    key={item.title}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "flex gap-5 py-3 transition-opacity duration-700 lg:border-t lg:border-ivory/10 lg:py-6",
                      "motion-safe:max-lg:[grid-area:1/1]",
                      isActive ? "opacity-100" : "motion-safe:opacity-40 max-lg:motion-safe:pointer-events-none max-lg:motion-safe:opacity-0",
                    )}
                  >
                    <Hallmark value={String(i + 1)} className={cn("mt-0.5 transition-colors duration-700", isActive ? "text-gold" : "text-ivory/60")} />
                    <div>
                      <h4 className="type-body font-medium text-ivory">{item.title}</h4>
                      <p className="type-small mt-1.5 max-w-[24rem] text-ivory/65">{item.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="type-label mt-6 text-ivory/60 lg:mt-10">
              {anatomy.note}{" "}
              <span className={cn("motion-reduce:hidden transition-opacity duration-700", step > 0 && "opacity-0")}>
                {anatomy.scrollHint}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
