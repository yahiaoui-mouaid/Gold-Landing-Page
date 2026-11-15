import { site } from "@/config/site";
import { contactCopy } from "@/content/copy";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Section 07: closing call to action. All contact values come from config/site.ts. */
export function Contact() {
  const { phone, email } = site.contact;

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-ink">
      {/* A single low, warm light — like the glow of the crucible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_70%_at_70%_100%,rgb(201_154_78/0.16),transparent_70%)]"
      />

      <div className="shell relative pb-20 pt-28 sm:pt-36 lg:pb-28 lg:pt-48">
        <SectionLabel>{contactCopy.label}</SectionLabel>
        <h2
          id="contact-title"
          data-split="reveal"
          className="type-hero mt-8 text-[clamp(2.1rem,9.6vw,4.5rem)] text-ivory md:text-[clamp(4.5rem,8vw,8.5rem)]"
        >
          {contactCopy.headline[0]}{" "}
          <br />
          {contactCopy.headline[1]}
        </h2>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <p className="type-lede max-w-[34rem] text-ivory/80">{contactCopy.body}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={email.href} className="btn-gold">
                {contactCopy.emailCta}
              </a>
              <a href={phone.href} className="btn-ghost text-ivory">
                {contactCopy.phoneCta}
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:col-start-8 lg:self-end">
            <div>
              <h3 className="type-label text-ivory/50">{contactCopy.detailsTitle}</h3>
              <ul className="mt-4 space-y-1">
                <li>
                  <a href={email.href} className="link-line text-ivory">
                    {email.display}
                  </a>
                </li>
                <li>
                  <a href={phone.href} className="link-line tabular text-ivory">
                    {phone.display}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="type-label text-ivory/50">{contactCopy.socialTitle}</h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-1">
                {site.social.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="link-line text-ivory">
                      {link.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
