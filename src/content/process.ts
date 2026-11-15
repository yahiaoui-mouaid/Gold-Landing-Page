import type { PhotoKey } from "./images";

export type ChapterId = "sourcing" | "fire" | "braid" | "finish";

export type Chapter = {
  id: ChapterId;
  name: string;
};

export type Stage = {
  /** 1-based position in the process. */
  index: number;
  chapter: ChapterId;
  title: string;
  body: string;
  photo: PhotoKey;
  /** CSS object-position used when the photograph is cropped. */
  focus: string;
  /** Stages that belong to the braiding craft, highlighted in the story. */
  signature?: boolean;
};

export const chapters: Chapter[] = [
  { id: "sourcing", name: "Sourcing" },
  { id: "fire", name: "Fire" },
  { id: "braid", name: "Wire and braid" },
  { id: "finish", name: "Finishing" },
];

export const stages: Stage[] = [
  {
    index: 1,
    chapter: "sourcing",
    title: "Raw gold",
    body: "Every piece begins as raw gold, purchased as nuggets and grain. Unshaped and uneven, it holds everything the finished necklace will become.",
    photo: "rawGold",
    focus: "62% 50%",
  },
  {
    index: 2,
    chapter: "sourcing",
    title: "Inspection and weighing",
    body: "Each lot is examined closely and weighed on precision scales, so the material is fully understood before any work begins.",
    photo: "inspection",
    focus: "58% 60%",
  },
  {
    index: 3,
    chapter: "fire",
    title: "Melting the gold",
    body: "In the crucible, solid gold is brought past its melting point and becomes a bright, liquid metal, ready to take a new form.",
    photo: "melting",
    focus: "58% 52%",
  },
  {
    index: 4,
    chapter: "fire",
    title: "Casting",
    body: "Molten gold is poured into a mould and left to solidify into a single, uniform ingot: the foundation for everything that follows.",
    photo: "casting",
    focus: "55% 45%",
  },
  {
    index: 5,
    chapter: "braid",
    title: "Wire manufacturing",
    body: "The ingot passes through the rolling mill again and again, drawn gradually down into long, even lengths of fine gold wire.",
    photo: "wire",
    focus: "60% 58%",
  },
  {
    index: 6,
    chapter: "braid",
    title: "Preparing the strands",
    body: "Fine wires are cut, straightened and gathered into strands, then laid out in order so each will sit correctly in the braid.",
    photo: "strands",
    focus: "50% 50%",
    signature: true,
  },
  {
    index: 7,
    chapter: "braid",
    title: "The braiding",
    body: "By hand, strand crosses over strand in a steady rhythm. Even tension and patience shape the pattern that defines the piece.",
    photo: "braiding",
    focus: "52% 50%",
    signature: true,
  },
  {
    index: 8,
    chapter: "braid",
    title: "The braid, up close",
    body: "Under magnification the structure is clear: dozens of fine wires moving together, each crossing placed where it belongs.",
    photo: "macro",
    focus: "50% 45%",
    signature: true,
  },
  {
    index: 9,
    chapter: "finish",
    title: "Finishing and assembly",
    body: "The ends of the braid are secured and the clasp fitted with fine pliers, joining braid and fittings into one secure piece.",
    photo: "finishing",
    focus: "50% 50%",
  },
  {
    index: 10,
    chapter: "finish",
    title: "Polishing",
    body: "Polishing wheels bring up the lustre of the gold, refining every surface while keeping the texture of each wire visible.",
    photo: "polishing",
    focus: "45% 55%",
  },
  {
    index: 11,
    chapter: "finish",
    title: "The finished necklace",
    body: "Supple, balanced and continuous from one clasp to the other, the braided necklace is complete.",
    photo: "product",
    focus: "55% 50%",
  },
  {
    index: 12,
    chapter: "finish",
    title: "Fine jewelry",
    body: "What arrived as raw gold leaves as a braided necklace, made to be worn and kept for a very long time.",
    photo: "hero",
    focus: "50% 50%",
  },
];

export const formatIndex = (n: number) => String(n).padStart(2, "0");
