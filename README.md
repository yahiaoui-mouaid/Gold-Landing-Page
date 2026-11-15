# Gold.Yh — website

Landing page for Gold.Yh, a gold manufacturing company that purchases raw gold and
turns it into braided gold necklaces. Frontend only; there is no backend.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (static)
npm start          # serve the production build
npm run typecheck
```

## Before launch: replace the placeholders

Everything company-specific lives in **`src/config/site.ts`**. Values marked
`PLACEHOLDER` are not real:

| Field | Used in |
| --- | --- |
| `contact.phone` (display text + `tel:` link) | Contact section, footer, mobile menu |
| `contact.email` (display text + `mailto:` link) | Contact section, footer, mobile menu |
| `social[]` (Instagram, Facebook, LinkedIn, WhatsApp) | Contact section, footer |
| `url` (production domain) | Page metadata |

All wording is in **`src/content/`**:

- `copy.ts`: section copy (hero, about, braid, transformation, approach, contact, footer)
- `process.ts`: the 12 manufacturing stages (title, text, photo, crop focus, chapter)
- `images.ts`: photo imports and their alt text

The copy deliberately makes no claims about history, certifications, capacity or
guarantees.

## Stack

| Choice | Why |
| --- | --- |
| Next.js 16 (App Router) + TypeScript | Static prerendering; static image imports give responsive AVIF/WebP and blur placeholders without touching the originals |
| Tailwind CSS v4 | Design tokens defined once in CSS (`src/app/globals.css`, `@theme`) |
| GSAP + ScrollTrigger + SplitText | Scroll-scrubbed storytelling, masked type reveals |
| Lenis | Smooth scrolling, driven by GSAP's ticker so it stays in sync with ScrollTrigger |
| Three.js (lazy-loaded) | One procedural 3D model of a braid, used only where it explains something the photos can't |

Typefaces (Bodoni Moda, Instrument Sans) are self-hosted from Fontsource
packages (SIL OFL), so builds never depend on a font server.

## Structure

```
images/                    the 12 original photographs (never modified)
src/
  app/                     layout (fonts, metadata, boot script), page, global CSS/tokens
  config/site.ts           company info, navigation, contact placeholders
  content/                 copy, process stages, image imports + alt text
  lib/                     GSAP registration, motion media queries, helpers
  components/
    layout/                Header, MobileMenu, Footer
    motion/                SmoothScroll (Lenis + anchors), ScrollEffects (data-attribute reveals)
    ui/                    Wordmark, Hallmark (stage number), SectionLabel
    sections/              Hero, About, Transformation, Approach, Contact
      process/             Process section + ProcessReel (the 12-stage story)
      braid/               BraidIntro, BraidAnatomy (3D), BraidProduct, braidScene.ts
```

## How the motion works

- **One entrance moment.** On first load a short curtain shows the wordmark,
  waits for the hero photo to decode (max 1.8 s), then reveals the hero. A
  script in `<head>` adds `intro-pending` before paint; a 6 s timer removes it
  if the app script never runs.
- **Process reel** (`ProcessReel.tsx`): on screens ≥ 1024 px a sticky,
  scroll-scrubbed sequence. Each photo wipes in over the last; chapter
  changes open from the centre. A rolling counter and a clickable rail show
  position, and the scroll settles on the nearest stage. To turn settling
  off, remove the `snap` block.
- **Braid model** (`braidScene.ts`): every wire is a tube whose centreline is
  computed in the vertex shader, so the whole braid is a single mesh and one
  draw call. Scroll progress morphs three flat ribbons of fine wire into a
  plait. Three.js loads only when the section approaches. The render loop
  pauses off-screen, and a photo is shown if WebGL is unavailable.
- **Declarative reveals**: server-rendered sections opt in with
  `data-split="reveal"`, `data-rule`, `data-parallax`, `data-reveal="frame"`
  (see `ScrollEffects.tsx`).

## Accessibility and responsiveness

- `prefers-reduced-motion`: no intro, no smooth scrolling, no pinned
  sequences. The process becomes a plain list and the braid model is shown
  already braided.
- Phone and tablet get their own layouts (stacked process, a full-bleed
  braid model with one step at a time), not a squeezed desktop.
- Skip link, landmarks, a single h1, ordered headings, descriptive alt text on
  every photo, keyboard-operable comparison slider (arrow keys, Home/End),
  focus kept inside the mobile menu, visible focus styles, and text contrast
  of at least 4.5:1.

## Performance (production build, local)

- About 360 KB transferred on first load: about 207 KB JS, 75 KB fonts, a
  48 KB AVIF hero image, 10 KB CSS.
- The Three.js chunk (about 135 KB gzipped) is fetched only near the braid
  section.
- LCP is the hero image. CLS is 0.

Note: the source photos are 1200 × 896, so very large full-bleed displays
(e.g. 4K) upscale them slightly. Higher-resolution originals can be dropped
into `images/` with the same filenames.
