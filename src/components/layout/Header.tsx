"use client";

import { useEffect, useRef, useState } from "react";
import { navigation } from "@/config/site";
import { cn } from "@/lib/cn";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "./MobileMenu";

const primaryLinks = navigation.filter((item) => item.id !== "contact");

/**
 * Fixed header: transparent over the hero, a dark veil once scrolled,
 * tucked away while reading downwards and back as soon as the reader scrolls up.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      setTucked(y > lastY.current && y > 240);
      lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Track which section is in the middle of the viewport.
  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[var(--ease-cinematic)]",
          tucked && !menuOpen && "-translate-y-full",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 border-b border-ivory/[0.07] bg-ink/80 backdrop-blur-md transition-opacity duration-500",
            scrolled && !menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div data-intro className="shell relative flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <a href="#top" className="relative z-10 -my-2 py-2" aria-label="Gold.Yh, back to top">
            <Wordmark className="text-[1.65rem] lg:text-[1.8rem]" />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-3">
              {primaryLinks.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative inline-flex px-3 py-3 text-[0.9375rem] transition-colors duration-300",
                        isActive ? "text-champagne" : "text-ivory/70 hover:text-ivory",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-3 bottom-2 h-px origin-left bg-gold transition-transform duration-500 ease-[var(--ease-cinematic)]",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a href="#contact" className="btn-ghost hidden min-h-11 px-5 text-ivory lg:inline-flex">
            Contact us
          </a>

          <button
            type="button"
            className="relative z-10 -mr-2 inline-flex h-11 items-center gap-3 px-2 text-[0.9375rem] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 top-0.5 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-cinematic)]",
                  menuOpen && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0.5 left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-cinematic)]",
                  menuOpen && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} />
    </>
  );
}
