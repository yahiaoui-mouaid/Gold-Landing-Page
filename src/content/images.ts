/**
 * The twelve production photographs, imported statically from /images.
 *
 * Static imports give Next.js the intrinsic size and a blur placeholder for
 * each file, and let it serve responsive AVIF/WebP variants. The original
 * files are left exactly as delivered.
 */
import rawGold from "@images/Stage 01 — Raw Gold.jpg";
import inspection from "@images/Stage 02 — Gold Inspection and Weighing.jpg";
import melting from "@images/Stage 03 — Melting the Gold.jpg";
import casting from "@images/Stage 04 — Gold Casting.jpg";
import wire from "@images/Stage 05 — Gold Wire Manufacturing.jpg";
import strands from "@images/Stage 06 — Preparing the Braided Necklace.jpg";
import braiding from "@images/Stage 07 — The Braiding Process.jpg";
import macro from "@images/Stage 08 — Braided Gold Macro Detail.jpg";
import finishing from "@images/Stage 09 — Finishing and Assembly.jpg";
import polishing from "@images/Stage 10 — Gold Polishing.jpg";
import product from "@images/Stage 11 — Finished Braided Necklace — Product Photography.jpg";
import hero from "@images/Stage 12 — The Hero Image.jpg";

export const photos = {
  rawGold,
  inspection,
  melting,
  casting,
  wire,
  strands,
  braiding,
  macro,
  finishing,
  polishing,
  product,
  hero,
} as const;

export type PhotoKey = keyof typeof photos;

/** Descriptive alternative text, written from what each photograph shows. */
export const photoAlt: Record<PhotoKey, string> = {
  rawGold:
    "Raw gold nuggets and loose grains of gold scattered across a dark slate surface.",
  inspection:
    "A craftsman uses tweezers to place a gold nugget on a precision scale, with more nuggets and grains on the workbench.",
  melting:
    "Gold nuggets melting into bright liquid metal inside a crucible over an electric furnace coil.",
  casting:
    "A gloved craftsman pours molten gold from a crucible into a tall ingot mould, sparks rising.",
  wire:
    "A gold ingot beside a hand-operated rolling mill, with a coil of finished gold wire on the bench.",
  strands:
    "Long, fine gold wires laid out in crossing groups on dark velvet, ready to be braided.",
  braiding:
    "Gloved hands interlacing fine gold wires into the first section of a braid under a bench lamp.",
  macro:
    "Close-up of a braided gold section, showing dozens of fine wires interwoven in an even pattern.",
  finishing:
    "A jeweller uses fine pliers to fit a polished gold clasp onto the end of a braided gold necklace.",
  polishing:
    "A braided gold necklace held against a spinning polishing wheel, the braid catching the light.",
  product:
    "A finished braided gold necklace with two polished clasps, laid in an S-curve on a dark display box.",
  hero:
    "A braided gold necklace suspended against a dark background lit by warm, golden light.",
};
