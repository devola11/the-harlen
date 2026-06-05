"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";

const SUITES: {
  slug: string;
  name: string;
  size: string;
  price: string;
  image: string;
}[] = [
  {
    slug: "studio-suite",
    name: "Studio Suite",
    size: "300–450 SQ FT",
    price: "From $395 / night",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=85",
  },
  {
    slug: "one-bedroom-suite",
    name: "One-Bedroom Suite",
    size: "700–950 SQ FT",
    price: "From $850 / night",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=85",
  },
  {
    slug: "penthouse",
    name: "Penthouse",
    size: "1,500+ SQ FT",
    price: "From $2,800 / night",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85",
  },
];

export default function SuitesPreview() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="bg-charcoal py-32 px-6 md:px-12 lg:px-24">
      <div className="text-center mb-16">
        <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
          Accommodations
        </p>
        <h2 className="font-cormorant text-[40px] md:text-[56px] font-light italic text-ivory">
          Six Ways to Experience The Harlen.
        </h2>
        <p className="font-dm-sans text-[16px] text-ivory/60 mt-4 max-w-[520px] mx-auto">
          From our intimate Studio Suites to the crowning Penthouse, every
          residence at The Harlen is a study in considered luxury.
        </p>
      </div>

      <div
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {SUITES.map((suite, i) => (
          <motion.div
            key={suite.slug}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{
              duration: 0.7,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={`/accommodations/${suite.slug}`}
              className="group relative block cursor-pointer overflow-hidden"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image
                  src={suite.image}
                  alt={suite.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-cormorant text-[26px] font-medium text-ivory">
                  {suite.name}
                </h3>
                <p className="font-dm-sans text-[11px] tracking-[0.15em] uppercase text-gold mt-1">
                  {suite.size}
                </p>
                <p className="font-dm-sans text-[13px] text-ivory/70 mt-1">
                  {suite.price}
                </p>
                <div className="mt-3 flex items-center gap-2 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="font-dm-sans text-[11px] tracking-[0.2em] uppercase text-gold">
                    Reserve
                  </span>
                  <ArrowRight size={14} strokeWidth={1.5} className="text-gold" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/accommodations"
          className="inline-flex items-center border border-gold/50 text-gold px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-gold hover:text-obsidian transition-all duration-300"
        >
          View All Accommodations
        </Link>
      </div>
    </section>
  );
}
