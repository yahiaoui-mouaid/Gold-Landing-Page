"use client";

import Image from "next/image";
import { useState } from "react";
import { braidCopy } from "@/content/copy";
import { photoAlt, photos } from "@/content/images";
import { cn } from "@/lib/cn";

const { product } = braidCopy;

/**
 * The finished necklace with numbered details. Each marker on the photograph
 * is paired with an entry in the list; hovering or focusing either one
 * highlights both.
 */
export function BraidProduct() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="shell grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:py-44">
      <figure className="relative lg:col-span-8">
        <div data-reveal="frame" className="relative aspect-[4/3] overflow-hidden bg-soot">
          <div data-reveal-media className="absolute inset-0">
            <Image
              src={photos.product}
              alt={photoAlt.product}
              fill
              quality={90}
              placeholder="blur"
              sizes="(min-width: 64rem) 62vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {product.details.map((detail, i) => {
          const isActive = active === detail.id;
          return (
            <button
              key={detail.id}
              type="button"
              aria-label={`Detail ${i + 1}: ${detail.title}`}
              aria-describedby={`detail-${detail.id}`}
              aria-pressed={isActive}
              onPointerEnter={() => setActive(detail.id)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(detail.id)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(isActive ? null : detail.id)}
              className="group absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${detail.x}%`, top: `${detail.y}%` }}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-1 rounded-full border transition-all duration-500 ease-[var(--ease-cinematic)]",
                  isActive ? "scale-125 border-champagne" : "scale-100 border-ivory/60",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "font-display relative flex size-7 items-center justify-center rounded-full text-[0.9rem] leading-none backdrop-blur-sm transition-colors duration-500",
                  isActive ? "bg-champagne text-ink" : "bg-ink/50 text-ivory",
                )}
              >
                {i + 1}
              </span>
            </button>
          );
        })}
      </figure>

      <div className="lg:col-span-4">
        <h3 className="type-heading text-ivory">{product.headline}</h3>
        <p className="type-body mt-5 max-w-[30rem] text-ivory/70">{product.body}</p>

        <ol className="mt-10 border-t border-ivory/10">
          {product.details.map((detail, i) => {
            const isActive = active === detail.id;
            return (
              <li
                key={detail.id}
                id={`detail-${detail.id}`}
                onPointerEnter={() => setActive(detail.id)}
                onPointerLeave={() => setActive(null)}
                className="flex gap-5 border-b border-ivory/10 py-5"
              >
                <span
                  aria-hidden
                  className={cn(
                    "font-display flex size-7 shrink-0 items-center justify-center rounded-full border text-[0.9rem] leading-none transition-colors duration-500",
                    isActive ? "border-champagne bg-champagne text-ink" : "border-ivory/40 text-ivory/80",
                  )}
                >
                  {i + 1}
                </span>
                <div>
                  <h4 className={cn("type-body font-medium transition-colors duration-500", isActive ? "text-champagne" : "text-ivory")}>
                    {detail.title}
                  </h4>
                  <p className="type-small mt-1 text-ivory/65">{detail.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
