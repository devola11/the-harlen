"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Armchair,
  Briefcase,
  ChefHat,
  Coffee,
  Dumbbell,
  Film,
  type LucideIcon,
  PhoneCall,
  Shield,
  Shirt,
  ShoppingBag,
  Sparkles,
  Wifi,
} from "lucide-react";

const AMENITIES: { icon: LucideIcon; name: string; desc: string }[] = [
  {
    icon: PhoneCall,
    name: "24/7 Concierge",
    desc: "Round-the-clock assistance for every need",
  },
  {
    icon: Sparkles,
    name: "Daily Housekeeping",
    desc: "Optional daily or weekly service",
  },
  {
    icon: ChefHat,
    name: "Gourmet Kitchen",
    desc: "Fully equipped with premium appliances",
  },
  {
    icon: Dumbbell,
    name: "Fitness Center",
    desc: "Technogym-equipped private gym",
  },
  {
    icon: Wifi,
    name: "Complimentary WiFi",
    desc: "High-speed throughout the residence",
  },
  {
    icon: Shirt,
    name: "Valet Laundry",
    desc: "Pickup, cleaning, and return service",
  },
  {
    icon: ShoppingBag,
    name: "Grocery Delivery",
    desc: "Pre-stocked pantry on request",
  },
  {
    icon: Film,
    name: "Private Cinema",
    desc: "Exclusive screening room access",
  },
  {
    icon: Armchair,
    name: "Residents Lounge",
    desc: "Members-only evening social space",
  },
  {
    icon: Briefcase,
    name: "Business Center",
    desc: "Printing, meeting rooms, workspace",
  },
  {
    icon: Coffee,
    name: "The Harlen Café",
    desc: "European-style café on the ground floor",
  },
  {
    icon: Shield,
    name: "24/7 Security",
    desc: "Doorman, keycard, and CCTV",
  },
];

export default function AmenitiesStrip() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section className="bg-ivory py-24 px-6 md:px-12 lg:px-24">
      <div className="mb-16">
        <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
          Amenities &amp; Services
        </p>
        <h2 className="font-cormorant text-[40px] md:text-[52px] font-light text-charcoal leading-tight">
          Everything you need.
          <br />
          Nothing you don&apos;t.
        </h2>
      </div>

      <div
        ref={ref}
        className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        {AMENITIES.map((amenity, i) => {
          const Icon = amenity.icon;
          return (
            <motion.div
              key={amenity.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex flex-col gap-3 p-6 border border-transparent hover:border-b-2 hover:border-b-gold hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <Icon size={24} strokeWidth={1.5} className="text-gold mb-1" />
              <h3 className="font-cormorant text-[20px] font-medium text-charcoal">
                {amenity.name}
              </h3>
              <p className="font-dm-sans text-[13px] text-ash leading-relaxed">
                {amenity.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/amenities"
          className="inline-flex items-center border border-charcoal/30 text-charcoal px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:border-charcoal hover:bg-charcoal hover:text-ivory transition-all duration-300"
        >
          Explore All Amenities
        </Link>
      </div>
    </section>
  );
}
