import { BraidAnatomy } from "./BraidAnatomy";
import { BraidIntro } from "./BraidIntro";
import { BraidProduct } from "./BraidProduct";

/** Section 04: the company's signature craft, in three movements. */
export function BraidedGold() {
  return (
    <section id="braided-gold" aria-labelledby="braid-title" className="relative bg-ink">
      <BraidIntro />
      <BraidAnatomy />
      <BraidProduct />
    </section>
  );
}
