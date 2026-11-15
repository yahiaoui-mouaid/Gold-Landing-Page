/**
 * Central company configuration.
 *
 * Everything a non-developer may need to change before launch lives here.
 * Values marked PLACEHOLDER are not real and must be replaced.
 */

export type SocialLink = {
  label: string;
  href: string;
};

export const site = {
  name: "Gold.Yh",
  /** PLACEHOLDER — final production domain. Used for metadata only. */
  url: "https://gold-yh.example",
  tagline: "From pure gold to timeless craftsmanship",
  description:
    "Gold.Yh purchases raw gold and transforms it into finely made jewelry, with a particular focus on braided gold necklaces.",

  contact: {
    /** PLACEHOLDER — replace with the real phone number (display + dialable form). */
    phone: {
      display: "+00 000 000 0000",
      href: "tel:+000000000000",
    },
    /** PLACEHOLDER — replace with the real enquiries address. */
    email: {
      display: "contact@gold-yh.example",
      href: "mailto:contact@gold-yh.example",
    },
  },

  /** PLACEHOLDER — replace each href with the company's real profile URL. */
  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "WhatsApp", href: "https://wa.me/000000000000" },
  ] satisfies SocialLink[],
} as const;

export type NavItem = {
  id: string;
  label: string;
};

/** In-page sections, in document order. `id` must match the section element id. */
export const navigation: NavItem[] = [
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "braided-gold", label: "Braided gold" },
  { id: "transformation", label: "Transformation" },
  { id: "approach", label: "Our approach" },
  { id: "contact", label: "Contact" },
];
