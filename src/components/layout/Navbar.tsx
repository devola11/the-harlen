"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Accommodations", href: "/accommodations" },
  { label: "Amenities", href: "/amenities" },
  { label: "Neighborhood", href: "/neighborhood" },
  { label: "Gallery", href: "/gallery" },
  { label: "Design", href: "/design" },
  { label: "Offers", href: "/offers" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-charcoal/90 backdrop-blur-md"
            : "bg-transparent backdrop-blur-0",
        )}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-5">
          <Link
            href="/"
            aria-label="The Harlen — home"
            className="font-cormorant text-xl uppercase tracking-[0.25em] text-gold"
          >
            The Harlen
          </Link>

          <ul className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative font-dm-sans text-[11px] uppercase tracking-[0.18em] text-ivory/70 hover:text-ivory transition-colors duration-300"
                >
                  {link.label}
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Link
              href="/reserve"
              className="hidden md:inline-flex border border-gold text-gold px-6 py-2 text-[11px] uppercase tracking-[0.2em] hover:bg-gold hover:text-obsidian transition-all duration-300"
            >
              Reserve Now
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-ivory"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-obsidian flex flex-col"
          >
            <div className="flex items-center justify-between px-6 md:px-12 py-5">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="font-cormorant text-xl uppercase tracking-[0.25em] text-gold"
              >
                The Harlen
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="text-ivory"
              >
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>

            <ul className="flex-1 flex flex-col items-center justify-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-cormorant text-[36px] font-light text-ivory hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + NAV_LINKS.length * 0.07,
                  duration: 0.5,
                }}
                className="mt-6"
              >
                <Link
                  href="/reserve"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex border border-gold text-gold px-8 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-gold hover:text-obsidian transition-all duration-300"
                >
                  Reserve Now
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
