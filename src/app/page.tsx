import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollEffects } from "@/components/motion/ScrollEffects";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { About } from "@/components/sections/About";
import { Approach } from "@/components/sections/Approach";
import { BraidedGold } from "@/components/sections/braid/BraidedGold";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/process/Process";
import { Transformation } from "@/components/sections/Transformation";

export default function Home() {
  return (
    <SmoothScroll>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[80] -translate-y-24 bg-champagne px-4 py-3 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Process />
        <BraidedGold />
        <Transformation />
        <Approach />
        <Contact />
      </main>
      <Footer />
      {/* Mounted last so it measures the final layout of every section. */}
      <ScrollEffects />
      <div className="grain" aria-hidden />
    </SmoothScroll>
  );
}
