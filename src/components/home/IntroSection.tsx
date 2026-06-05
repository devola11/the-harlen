"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const STATS: { value: string; label: string }[] = [
  { value: "6", label: "Suite Types" },
  { value: "24/7", label: "Concierge" },
  { value: "0.2mi", label: "From Central Park" },
  { value: "100%", label: "Serviced" },
];

export default function IntroSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="bg-cream py-32 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16 items-center">
        <div>
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            Our Story
          </p>
          <p className="font-cormorant text-[120px] font-light text-linen leading-none">
            Est. 2024
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-cormorant text-[40px] md:text-[52px] lg:text-[56px] font-light italic text-charcoal leading-tight mb-8">
            A New Standard for New York Living.
          </h2>

          <p className="font-dm-sans text-[16px] md:text-[17px] font-light text-ash leading-loose max-w-[560px]">
            The Harlen was conceived for a singular purpose: to offer New York
            City&apos;s most discerning visitors a residence that transcends
            the ordinary. Steps from Central Park on Manhattan&apos;s beloved
            Upper West Side, our suites combine hotel-level service with the
            intimacy and privacy of your own home. Whether you arrive for a
            week or a season, The Harlen greets you not as a guest, but as a
            resident.
          </p>

          <div className="w-16 h-px bg-gold my-8" />

          <div className="flex flex-wrap gap-8 md:gap-12 mt-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-cormorant text-[48px] font-light text-charcoal leading-none">
                  {stat.value}
                </span>
                <span className="font-dm-sans text-[10px] tracking-[0.2em] uppercase text-ash mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
