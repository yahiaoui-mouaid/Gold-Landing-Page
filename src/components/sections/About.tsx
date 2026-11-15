import Image from "next/image";
import { aboutCopy } from "@/content/copy";
import { photoAlt, photos } from "@/content/images";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="on-light relative bg-ivory text-umber">
      <div className="shell py-24 sm:py-32 lg:py-44">
        <SectionLabel tone="light">{aboutCopy.label}</SectionLabel>
        <h2
          id="about-title"
          data-split="reveal"
          className="type-display mt-6 max-w-[15ch] text-ink lg:mt-8"
        >
          {aboutCopy.headline}
        </h2>

        <div className="mt-16 grid gap-y-24 lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
          {/* Layered photographs: evaluation first, the finished craft overlapping it. */}
          <div className="relative pb-[18%] lg:col-span-6 lg:pb-0">
            <figure data-reveal="frame" className="relative aspect-[4/5] w-[80%] overflow-hidden bg-umber lg:w-[78%]">
              <div data-reveal-media className="absolute inset-0">
                <div data-parallax="5" className="absolute inset-x-0 -inset-y-[7%]">
                  <Image
                    src={photos.inspection}
                    alt={photoAlt.inspection}
                    fill
                    quality={80}
                    placeholder="blur"
                    sizes="(min-width: 64rem) 36vw, 80vw"
                    className="object-cover object-[52%_62%]"
                  />
                </div>
              </div>
            </figure>
            <div data-parallax="14" className="absolute bottom-0 right-0 w-[52%] lg:-bottom-[14%] lg:w-[50%]">
              <figure
                data-reveal="frame"
                className="relative aspect-[4/5] overflow-hidden bg-umber shadow-[0_0_0_10px_var(--color-ivory)] sm:shadow-[0_0_0_14px_var(--color-ivory)]"
              >
                <div data-reveal-media className="absolute inset-0">
                  <Image
                    src={photos.finishing}
                    alt={photoAlt.finishing}
                    fill
                    quality={80}
                    placeholder="blur"
                    sizes="(min-width: 64rem) 24vw, 52vw"
                    className="object-cover object-[46%_52%]"
                  />
                </div>
              </figure>
            </div>
            <p className="type-label mt-5 max-w-[44%] text-stone">{aboutCopy.imageCaption}</p>
          </div>

          <div className="flex flex-col gap-16 lg:col-span-5 lg:col-start-8 lg:pt-8">
            <div className="space-y-6">
              <p className="type-lede text-ink">{aboutCopy.paragraphs[0]}</p>
              <p className="type-body max-w-[34rem] text-stone">{aboutCopy.paragraphs[1]}</p>
            </div>

            <ul className="grid gap-9 sm:grid-cols-3 sm:gap-6 lg:grid-cols-1 lg:gap-0">
              {aboutCopy.pillars.map((pillar) => (
                <li key={pillar.title} className="lg:py-6">
                  <span data-rule className="rule text-umber" />
                  <h3 className="type-title mt-5 text-ink lg:mt-6">{pillar.title}</h3>
                  <p className="type-small mt-2 max-w-[30rem] text-stone">{pillar.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
