"use client";

import Image from "next/image";
import { useRef } from "react";
import { braidCopy } from "@/content/copy";
import { photoAlt, photos } from "@/content/images";
import { gsap, useGSAP } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

/**
 * Opening of the braided-gold section. On wide screens the macro photograph
 * starts as a small window between the two halves of the title, then opens to
 * fill the screen as the reader scrolls, pushing the words aside.
 */
export function BraidIntro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.reel, () => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          })
          .fromTo(
            "[data-braid-frame]",
            { clipPath: "inset(25% 34% 25% 34%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" },
            0,
          )
          .fromTo("[data-braid-image]", { scale: 1.45 }, { scale: 1, duration: 1.1, ease: "power1.out" }, 0)
          .to('[data-braid-line="left"]', { xPercent: -70, opacity: 0, duration: 0.6, ease: "power2.in" }, 0.2)
          .to('[data-braid-line="right"]', { xPercent: 70, opacity: 0, duration: 0.6, ease: "power2.in" }, 0.2)
          .fromTo("[data-braid-shade]", { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.8)
          .fromTo("[data-braid-copy]", { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.9)
          .to({}, { duration: 0.35 });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative pt-24 sm:pt-32 reel:h-[260vh] reel:pt-0">
      <div className="reel:sticky reel:top-0 reel:h-[100svh] reel:overflow-hidden">
        <h2
          id="braid-title"
          className="shell type-display text-ivory reel:pointer-events-none reel:absolute reel:inset-0 reel:z-10 reel:flex reel:max-w-none reel:items-center reel:justify-between reel:text-[clamp(3rem,4.5vw,5.5rem)]"
        >
          <span data-braid-line="left" className="block reel:w-[32%] reel:whitespace-nowrap reel:text-right">
            The art of
          </span>{" "}
          <span data-braid-line="right" className="block reel:w-[32%] reel:whitespace-nowrap">
            braided gold
          </span>
        </h2>

        <figure
          data-braid-frame
          data-reveal="frame"
          data-reveal-compact
          className="relative mt-10 aspect-[4/5] overflow-hidden bg-soot xs:aspect-[4/3] sm:mt-14 reel:absolute reel:inset-0 reel:mt-0 reel:aspect-auto"
        >
          <div data-braid-image data-reveal-media className="absolute inset-0 will-change-transform">
            <Image
              src={photos.macro}
              alt={photoAlt.macro}
              fill
              quality={90}
              placeholder="blur"
              sizes="100vw"
              className="object-cover object-[50%_45%]"
            />
          </div>
          <div
            data-braid-shade
            aria-hidden
            className="absolute inset-0 hidden bg-[linear-gradient(to_top_left,rgb(16_13_10/0.92)_0%,rgb(16_13_10/0.55)_38%,transparent_70%)] reel:block"
          />
        </figure>

        <div
          data-braid-copy
          className="shell mt-10 sm:mt-14 reel:absolute reel:bottom-[10svh] reel:right-0 reel:mt-0 reel:w-auto reel:max-w-[38rem] reel:px-[clamp(1.25rem,4.2vw,4rem)]"
        >
          <p className="type-lede text-champagne">{braidCopy.lede}</p>
          <p className="type-body mt-4 max-w-[34rem] text-ivory/75">{braidCopy.body}</p>
        </div>
      </div>
    </div>
  );
}
