"use client";

import { useEffect, useRef } from "react";
import { navigation, site } from "@/config/site";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useLenis } from "@/components/motion/SmoothScroll";

type Props = {
  open: boolean;
  onClose: () => void;
  active: string | null;
};

/** Full-screen navigation for small screens. */
export function MobileMenu({ open, onClose, active }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      timeline.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo(
          root.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power3.inOut" },
        )
        .from(
          "[data-menu-item]",
          { yPercent: 110, duration: 0.9, stagger: 0.06, ease: "expo.out" },
          0.35,
        )
        .from("[data-menu-foot]", { autoAlpha: 0, y: 12, duration: 0.6 }, 0.6);
    },
    { scope: root },
  );

  useEffect(() => {
    const tl = timeline.current;
    const html = document.documentElement;
    // Keep keyboard focus inside the menu while it is open (the header's Close stays reachable).
    for (const el of [document.getElementById("main"), document.querySelector("body > footer, footer")]) {
      el?.toggleAttribute("inert", open);
    }
    if (open) {
      lenis?.stop();
      html.style.overflow = "hidden";
      if (prefersReducedMotion()) tl?.progress(1);
      else tl?.timeScale(1).play();
      // The panel must be visible before it can take focus.
      gsap.set(root.current, { visibility: "visible" });
      root.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      html.style.overflow = "";
      lenis?.start();
      if (prefersReducedMotion()) tl?.progress(0);
      else tl?.timeScale(1.6).reverse();
    }
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]')?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 64rem)").matches) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      className="invisible fixed inset-0 z-40 flex flex-col bg-soot pt-[4.5rem] lg:hidden"
    >
      <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-center">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.id} className="overflow-hidden">
              <a
                data-menu-item
                href={`#${item.id}`}
                onClick={onClose}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "font-display block py-1.5 text-[clamp(2.25rem,9vw,3.5rem)] leading-[1.08] tracking-[-0.025em]",
                  active === item.id ? "text-champagne" : "text-ivory",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div data-menu-foot className="shell grid gap-1 border-t border-ivory/10 py-8 text-ivory/70">
        <a href={site.contact.email.href} className="w-fit py-1.5">
          {site.contact.email.display}
        </a>
        <a href={site.contact.phone.href} className="tabular w-fit py-1.5">
          {site.contact.phone.display}
        </a>
      </div>
    </div>
  );
}
