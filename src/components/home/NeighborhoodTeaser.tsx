"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";

const LANDMARKS: { name: string; distance: string }[] = [
  { name: "Central Park", distance: "0.2 miles" },
  { name: "Natural History Museum", distance: "0.3 miles" },
  { name: "Lincoln Center", distance: "0.8 miles" },
  { name: "Columbus Circle", distance: "1.1 miles" },
  { name: "Riverside Park", distance: "0.5 miles" },
  { name: "The Met", distance: "1.4 miles" },
];

export default function NeighborhoodTeaser() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="flex flex-col lg:flex-row min-h-[600px]">
      <div className="flex-1 relative overflow-hidden min-h-[400px] lg:min-h-full">
        <Image
          src="https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1200&q=85"
          alt="The Upper West Side of Manhattan"
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-transparent to-obsidian/40"
        />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 60 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="lg:w-[45%] bg-obsidian flex flex-col justify-center px-10 md:px-16 py-20"
      >
        <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-6">
          Neighborhood
        </p>
        <h2 className="font-cormorant text-[52px] md:text-[64px] lg:text-[72px] font-light italic text-ivory leading-none mb-8">
          The Upper
          <br />
          West Side.
        </h2>
        <p className="font-dm-sans text-[15px] md:text-[16px] text-ivory/70 leading-loose max-w-[400px]">
          Stroll to Central Park at dawn. Browse world-class galleries. Dine at
          Manhattan&apos;s finest tables. The Harlen places you at the
          cultural heart of one of the world&apos;s great neighborhoods.
        </p>

        <ul className="mt-10 space-y-3">
          {LANDMARKS.map((landmark) => (
            <li key={landmark.name} className="flex items-center gap-4">
              <span
                aria-hidden
                className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0"
              />
              <span className="font-dm-sans text-[13px] text-ivory/80 flex-1">
                {landmark.name}
              </span>
              <span className="font-dm-sans text-[12px] tracking-[0.1em] text-gold">
                {landmark.distance}
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/neighborhood"
          className="mt-10 inline-flex items-center gap-2 font-dm-sans text-[11px] tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors w-fit"
        >
          Explore the Neighborhood
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </motion.div>
    </section>
  );
}
