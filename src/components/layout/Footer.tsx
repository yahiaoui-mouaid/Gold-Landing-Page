import { navigation, site } from "@/config/site";
import { footerCopy } from "@/content/copy";
import { Wordmark } from "@/components/ui/Wordmark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ivory/[0.08] bg-ink text-ivory">
      <div className="shell grid gap-12 pb-10 pt-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:pt-24">
        <div className="sm:col-span-2 lg:col-span-5">
          <Wordmark className="text-[2.25rem]" />
          <p className="type-small mt-5 max-w-[24rem] text-ivory/60">{footerCopy.description}</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
          <h2 className="type-label text-ivory/60">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-1">
            {navigation.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="inline-block py-1.5 text-ivory/80 transition-colors hover:text-champagne">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="type-label text-ivory/60">Contact</h2>
          <ul className="mt-4">
            <li>
              <a href={site.contact.email.href} className="inline-block py-1.5 text-ivory/80 transition-colors hover:text-champagne">
                {site.contact.email.display}
              </a>
            </li>
            <li>
              <a href={site.contact.phone.href} className="tabular inline-block py-1.5 text-ivory/80 transition-colors hover:text-champagne">
                {site.contact.phone.display}
              </a>
            </li>
          </ul>
          <ul className="mt-4 flex flex-wrap gap-x-5">
            {site.social.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1.5 text-[0.9375rem] text-ivory/60 transition-colors hover:text-champagne"
                >
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-3 border-t border-ivory/[0.08] py-6 text-[0.875rem] text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}. {footerCopy.rights}
        </p>
        <a href="#top" className="w-fit py-1 transition-colors hover:text-champagne">
          Back to top
        </a>
      </div>

      {/* Oversized wordmark, cropped by the page edge. */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="font-display translate-y-[22%] whitespace-nowrap text-center text-[25vw] leading-[0.8] tracking-[-0.05em] text-ivory/[0.045] [font-variation-settings:'opsz'_96]">
          Gold<span className="text-gold/25">.</span>Yh
        </p>
      </div>
    </footer>
  );
}
