import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";

export const metadata: Metadata = {
  title: "Design",
  description:
    "The Harlen aesthetic — a considered approach to luxury living. Carrara marble, American walnut, brushed brass, and light as architecture on Manhattan's Upper West Side.",
};

type Material = {
  src: string;
  name: string;
  origin: string;
  desc: string;
};

const MATERIALS: Material[] = [
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=85",
    name: "Carrara Marble",
    origin: "Quarried in Tuscany, Italy",
    desc: "White Carrara marble — the stone of Michelangelo — lines every bathroom surface. Its cool luminosity and natural veining make each space singular.",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85",
    name: "American Walnut",
    origin: "Sustainably Sourced, Pacific Northwest",
    desc: "Warm, deeply grained American walnut forms all custom millwork and cabinetry — grounding each residence with natural warmth and tactile richness.",
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd3?w=600&q=85",
    name: "Brushed Brass",
    origin: "Custom Cast, New York",
    desc: "All hardware, fixtures, and accent details are finished in hand-brushed brass — warm, considered, and built to develop character with time.",
  },
];

type Swatch = { className: string; name: string; hex: string };

const PALETTE: Swatch[] = [
  { className: "bg-[#0C0C0C]", name: "Obsidian", hex: "#0C0C0C" },
  { className: "bg-[#F5F0E8]", name: "Warm Ivory", hex: "#F5F0E8" },
  { className: "bg-[#C9A067]", name: "Burnished Gold", hex: "#C9A067" },
  { className: "bg-[#2D2D2D]", name: "Graphite", hex: "#2D2D2D" },
  { className: "bg-[#8B6F47]", name: "Deep Walnut", hex: "#8B6F47" },
];

export default function DesignPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=90"
          alt="The Harlen interior"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-obsidian/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 pt-32">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-6">
            Interior Design
          </p>
          <h1 className="font-cormorant text-[56px] md:text-[80px] lg:text-[110px] font-light italic text-ivory leading-none">
            The Harlen Aesthetic.
          </h1>
          <p className="mt-6 max-w-[560px] mx-auto font-dm-sans text-[18px] text-ivory/70 font-light">
            A considered approach to luxury living.
          </p>
        </div>
      </section>

      {/* Section 1 — Philosophy */}
      <section className="bg-cream py-32 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=85"
              alt="A restrained, considered interior at The Harlen"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>

          <FadeUp>
            <p className="font-dm-sans text-[9px] tracking-[0.3em] uppercase text-gold mb-4">
              Philosophy
            </p>
            <h2 className="font-cormorant text-[40px] md:text-[52px] text-charcoal italic font-light leading-tight mt-2">
              A Philosophy
              <br />
              of Restraint.
            </h2>
            <div className="w-12 h-px bg-gold my-8" />
            <div className="space-y-4 font-dm-sans text-[16px] text-ash leading-loose">
              <p>
                Every surface at The Harlen was chosen with purpose. We believe
                luxury is not about abundance — it is about precision. The
                absence of excess. The confidence of restraint.
              </p>
              <p>
                Each suite was designed around a single question: what does a
                well-travelled, discerning guest truly need? The answer shaped
                every decision — from the thread count of the linens to the
                weight of the door handles.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Section 2 — Materials & Craft */}
      <section className="bg-charcoal py-32 px-6 md:px-12 lg:px-24">
        <FadeUp className="text-center mb-16">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            Materials
          </p>
          <h2 className="font-cormorant text-[40px] md:text-[56px] text-ivory italic font-light">
            Chosen with intention.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {MATERIALS.map((m, i) => (
            <FadeUp key={m.name} delay={i * 0.1}>
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={m.src}
                  alt={m.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-cormorant text-[28px] text-ivory font-medium mb-2">
                {m.name}
              </h3>
              <p className="font-dm-sans text-[11px] text-gold tracking-[0.15em] uppercase mb-4">
                {m.origin}
              </p>
              <p className="font-dm-sans text-[14px] text-ivory/60 leading-relaxed">
                {m.desc}
              </p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Section 3 — Light as Architecture */}
      <section className="bg-ivory py-32">
        <div className="relative w-full aspect-[21/9] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=85"
            alt="Light moving through a Harlen residence"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <FadeUp className="max-w-[800px] mx-auto text-center px-6 py-20">
          <span
            aria-hidden
            className="font-cormorant text-[120px] text-gold/20 leading-none select-none block"
          >
            &ldquo;
          </span>
          <p className="font-cormorant text-[28px] md:text-[36px] italic text-charcoal font-light leading-relaxed max-w-[640px] mx-auto">
            We designed each residence around light — the way it moves through a
            room from dawn to dusk is as important as any piece of furniture.
          </p>
          <p className="font-dm-sans text-[12px] text-ash tracking-[0.15em] uppercase mt-8">
            — The Harlen Design Team
          </p>
        </FadeUp>
      </section>

      {/* Section 4 — The Harlen Palette */}
      <section className="bg-cream py-32 px-6 md:px-12 lg:px-24">
        <FadeUp className="mb-16">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            Colour Palette
          </p>
          <h2 className="font-cormorant text-[40px] md:text-[48px] text-charcoal italic font-light">
            A warm, considered palette.
          </h2>
        </FadeUp>

        <FadeUp className="flex flex-wrap gap-6">
          {PALETTE.map((c) => (
            <div
              key={c.name}
              className="w-full sm:w-[calc(20%-1.2rem)] min-w-[140px]"
            >
              <div
                className={`${c.className} h-32 w-full mb-4 border border-charcoal/20`}
              />
              <p className="font-cormorant text-[20px] text-charcoal font-medium">
                {c.name}
              </p>
              <p className="font-dm-sans text-[11px] text-ash tracking-[0.1em]">
                {c.hex}
              </p>
            </div>
          ))}
        </FadeUp>
      </section>

      {/* Section 5 — Commission CTA */}
      <section className="bg-charcoal py-24 px-6 text-center">
        <FadeUp>
          <h2 className="font-cormorant text-[40px] md:text-[48px] text-ivory italic font-light">
            Experience The Harlen Design.
          </h2>
          <p className="font-dm-sans text-[15px] text-ivory/60 mt-4 max-w-[480px] mx-auto">
            Tour our model residence and experience the materials, light, and
            craftsmanship in person.
          </p>
          <Link
            href="/reserve"
            className="inline-block mt-10 bg-gold text-obsidian px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all"
          >
            Reserve Your Suite
          </Link>
        </FadeUp>
      </section>
    </main>
  );
}
