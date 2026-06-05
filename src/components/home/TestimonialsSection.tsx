"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type Testimonial = {
  id: number;
  quote: string;
  guest: string;
  stay: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      "The Harlen is unlike anything I have experienced in New York. The attention to detail is extraordinary — it truly feels like a five-star home.",
    guest: "James R.",
    stay: "Superior Suite · 3 weeks · London",
  },
  {
    id: 2,
    quote:
      "For my annual New York residency, I have tried many addresses. The Harlen is now the only one I give.",
    guest: "Adaeze M.",
    stay: "One-Bedroom Suite · 1 month · Lagos",
  },
  {
    id: 3,
    quote:
      "Central Park at dawn from my window. The concierge knew my coffee order by day two. This is what travel should feel like.",
    guest: "Hiroshi T.",
    stay: "Penthouse · 1 week · Tokyo",
  },
  {
    id: 4,
    quote:
      "We brought the family for the holidays. The Two-Bedroom was spacious, warm, and flawlessly serviced.",
    guest: "The Williams Family",
    stay: "Two-Bedroom Suite · 10 nights · Atlanta",
  },
  {
    id: 5,
    quote:
      "As a corporate traveler, I need efficiency and comfort. The Harlen delivers both without compromise.",
    guest: "Marcus D.",
    stay: "Deluxe Studio · 6 weeks · Chicago",
  },
];

export default function TestimonialsSection() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section className="bg-cream py-32 px-6 md:px-12 lg:px-24">
      <div className="text-center mb-16">
        <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
          Guest Experiences
        </p>
        <h2 className="font-cormorant text-[40px] md:text-[52px] font-light italic text-charcoal">
          What our residents say.
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -mx-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-3"
            >
              <article className="h-full bg-white border border-linen p-8 md:p-10 flex flex-col gap-6">
                <div
                  aria-label="5 out of 5 stars"
                  className="text-gold text-lg tracking-wider"
                >
                  ★★★★★
                </div>
                <div
                  aria-hidden
                  className="font-cormorant text-[80px] text-gold/30 leading-none mb-0"
                >
                  &ldquo;
                </div>
                <p className="font-cormorant text-[20px] md:text-[22px] font-light italic text-charcoal leading-relaxed max-w-[380px]">
                  {t.quote}
                </p>
                <div aria-hidden className="w-10 h-px bg-gold my-2" />
                <div>
                  <p className="font-dm-sans text-[12px] tracking-[0.15em] uppercase text-ash font-medium">
                    {t.guest}
                  </p>
                  <p className="font-dm-sans text-[11px] tracking-[0.1em] text-gold mt-1">
                    {t.stay}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
