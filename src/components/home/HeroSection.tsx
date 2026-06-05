"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const TITLE_LINES: string[][] = [
  ["The", "Art", "of"],
  ["Living", "Well."],
];

export default function HeroSection() {
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  let wordCounter = 0;

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
        alt="The Harlen — luxury serviced residence on the Upper West Side"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0.85) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-1 flex-col justify-end px-6 md:px-12 lg:px-24 pt-32 pb-40">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-dm-sans text-[11px] uppercase tracking-[0.25em] text-gold mb-6"
        >
          Upper West Side · New York
        </motion.p>

        <h1 className="font-cormorant text-[52px] md:text-[80px] lg:text-[120px] font-light text-ivory leading-none tracking-[-0.02em]">
          {TITLE_LINES.map((line, lineIdx) => (
            <span key={lineIdx} className="block overflow-hidden">
              {line.map((word) => {
                const i = wordCounter++;
                return (
                  <motion.span
                    key={`${lineIdx}-${i}`}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block mr-[0.25em] last:mr-0"
                  >
                    {word}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-dm-sans text-base md:text-[18px] font-light text-ivory/80 mt-6 max-w-[480px]"
        >
          Luxury serviced residences in the heart of Manhattan&apos;s Upper West
          Side.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="mt-10 flex flex-wrap gap-4 md:gap-6"
        >
          <Link
            href="/reserve"
            className="inline-flex items-center justify-center bg-gold text-obsidian px-8 md:px-10 py-3 md:py-4 text-[11px] md:text-[12px] uppercase tracking-[0.2em] hover:bg-gold-light transition-all duration-300"
          >
            Reserve Your Stay
          </Link>
          <Link
            href="/accommodations"
            className="inline-flex items-center justify-center border border-ivory/50 text-ivory px-8 md:px-10 py-3 md:py-4 text-[11px] md:text-[12px] uppercase tracking-[0.2em] hover:border-gold hover:text-gold transition-all duration-300"
          >
            Explore Suites
          </Link>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-6 right-8 z-10 text-ivory/50 animate-bounce"
        aria-hidden
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
