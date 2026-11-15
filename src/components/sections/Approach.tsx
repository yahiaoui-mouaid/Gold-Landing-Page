import { approachCopy } from "@/content/copy";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Section 06: the company's approach, as principles rather than claims. */
export function Approach() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="on-light relative bg-ivory text-umber">
      <div className="shell grid gap-y-14 py-24 sm:py-32 lg:grid-cols-12 lg:gap-x-8 lg:py-44">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionLabel tone="light">{approachCopy.label}</SectionLabel>
            <h2 id="approach-title" data-split="reveal" className="type-display mt-6 max-w-[13ch] text-ink lg:mt-8">
              {approachCopy.headline}
            </h2>
            <p className="type-body mt-8 max-w-[28rem] text-stone">{approachCopy.intro}</p>
          </div>
        </div>

        <ul className="lg:col-span-6 lg:col-start-7">
          {approachCopy.values.map((value) => (
            <li key={value.title} className="group relative">
              <span data-rule className="rule text-umber" />
              <div className="grid gap-3 py-9 transition-transform duration-700 ease-[var(--ease-cinematic)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:gap-8 lg:py-11 lg:group-hover:translate-x-3">
                <h3 className="type-title text-ink">{value.title}</h3>
                <p className="type-body text-stone">{value.body}</p>
              </div>
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-bronze transition-transform duration-700 ease-[var(--ease-cinematic)] lg:group-hover:scale-x-100"
              />
            </li>
          ))}
          <li aria-hidden>
            <span data-rule className="rule text-umber" />
          </li>
        </ul>
      </div>
    </section>
  );
}
