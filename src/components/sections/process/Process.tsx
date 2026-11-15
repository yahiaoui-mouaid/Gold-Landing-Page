import { processCopy } from "@/content/copy";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProcessReel } from "./ProcessReel";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative bg-ink">
      <header className="shell grid gap-y-8 pb-12 pt-24 sm:pt-32 lg:grid-cols-12 lg:gap-x-8 lg:pb-20 lg:pt-44">
        <div className="lg:col-span-8">
          <SectionLabel>{processCopy.label}</SectionLabel>
          <h2 id="process-title" data-split="reveal" className="type-display mt-6 max-w-[17ch] lg:mt-8">
            {processCopy.headline}
          </h2>
        </div>
        <p className="type-body max-w-[30rem] self-end text-ivory/70 lg:col-span-4 lg:pb-3">
          {processCopy.intro}
        </p>
      </header>

      <ProcessReel />
    </section>
  );
}
