"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CheckCircle } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import type { SuiteData } from "@/lib/suites";

type Props = { suite: SuiteData; index: number };

export default function SuiteListItem({ suite, index }: Props) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const isReversed = index % 2 === 1;

  const bedroomsDisplay = suite.bedrooms === 0 ? "Studio" : String(suite.bedrooms);

  const specs: { value: string; label: string }[] = [
    { value: suite.sizeRange, label: "Sq Ft" },
    { value: String(suite.guests), label: "Guests" },
    { value: bedroomsDisplay, label: "Bedrooms" },
    { value: suite.bathrooms, label: "Bathrooms" },
    { value: suite.bedType, label: "Bed Type" },
  ];

  return (
    <article
      className={cn(
        "flex flex-col min-h-[600px]",
        isReversed ? "lg:flex-row-reverse" : "lg:flex-row",
      )}
    >
      <div className="group relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:w-[55%]">
        <Image
          src={suite.image}
          alt={suite.name}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-cream flex flex-col justify-center px-10 md:px-16 py-16 lg:w-[45%]"
      >
        <span
          aria-hidden
          className="absolute top-8 right-8 font-cormorant text-[100px] font-light text-linen/50 leading-none"
        >
          {suite.number}
        </span>

        <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
          Suite Type
        </p>
        <h3 className="font-cormorant text-[40px] md:text-[52px] font-light text-charcoal leading-tight mb-2">
          {suite.name}
        </h3>
        <p className="font-cormorant text-[20px] italic text-ash mb-6">
          {suite.tagline}
        </p>

        <div aria-hidden className="w-12 h-px bg-gold mb-6" />

        <div className="flex flex-wrap gap-6 mb-6">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col">
              <span className="font-cormorant text-[24px] font-medium text-charcoal">
                {spec.value}
              </span>
              <span className="font-dm-sans text-[10px] tracking-[0.15em] uppercase text-ash">
                {spec.label}
              </span>
            </div>
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-2 mb-8">
          {suite.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <CheckCircle
                size={14}
                strokeWidth={1.5}
                className="text-gold flex-shrink-0 mt-0.5"
              />
              <span className="font-dm-sans text-[13px] text-ash">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="bg-charcoal p-6 mb-8">
          <p className="font-dm-sans text-[9px] tracking-[0.25em] uppercase text-gold">
            From
          </p>
          <p className="mt-1">
            <span className="font-cormorant text-[48px] font-light text-ivory leading-none">
              {formatCurrency(suite.pricePerNight)}
            </span>
            <span className="font-dm-sans text-[13px] text-ivory/50 ml-2">
              /night
            </span>
          </p>
          <div className="mt-3 flex gap-6">
            <div>
              <p className="font-dm-sans text-[9px] tracking-[0.2em] uppercase text-gold">
                Weekly
              </p>
              <p className="font-dm-sans text-[13px] text-ivory/70 mt-1">
                From {formatCurrency(suite.weeklyPrice)}
              </p>
            </div>
            <div>
              <p className="font-dm-sans text-[9px] tracking-[0.2em] uppercase text-gold">
                Monthly
              </p>
              <p className="font-dm-sans text-[13px] text-ivory/70 mt-1">
                From {formatCurrency(suite.monthlyPrice)}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/reserve?suite=${suite.slug}`}
          className="inline-flex w-fit items-center bg-gold text-obsidian px-8 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300"
        >
          Reserve This Suite
        </Link>
      </motion.div>
    </article>
  );
}
