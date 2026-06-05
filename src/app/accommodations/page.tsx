import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SuiteListItem from "@/components/accommodations/SuiteListItem";
import { SUITES } from "@/lib/suites";

export const metadata: Metadata = {
  title: "Our Residences",
  description:
    "Six luxury serviced suites at The Harlen — from Studio to Penthouse — on Manhattan's Upper West Side.",
};

export default function AccommodationsPage() {
  return (
    <main>
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=90"
          alt="The Harlen residences"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-obsidian/60" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            The Harlen
          </p>
          <h1 className="font-cormorant text-[64px] md:text-[80px] lg:text-[100px] font-light italic text-ivory leading-none">
            Our Residences
          </h1>
        </div>
      </section>

      <section className="bg-cream py-20 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-cormorant text-[32px] md:text-[40px] font-light text-charcoal">
              SIX SUITES. ONE STANDARD.
            </h2>
          </div>
          <div>
            <p className="font-dm-sans text-[15px] text-ash leading-loose">
              Each residence at The Harlen is a complete home — fully
              furnished, fully serviced, and designed with the same obsessive
              attention to detail. Choose the scale that suits your stay.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ivory">
        {SUITES.map((suite, i) => (
          <SuiteListItem key={suite.slug} suite={suite} index={i} />
        ))}
      </section>

      <section className="bg-charcoal py-24 px-6 md:px-12 lg:px-24 text-center">
        <h2 className="font-cormorant text-[48px] font-light italic text-ivory">
          Ready to experience The Harlen?
        </h2>
        <p className="font-dm-sans text-[15px] text-ivory/60 mt-4">
          Our team is available 24 hours a day to assist with your reservation.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Link
            href="/reserve"
            className="inline-flex items-center bg-gold text-obsidian px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300"
          >
            Reserve Now
          </Link>
          <a
            href="mailto:reservations@theharlen.com"
            className="inline-flex items-center border border-ivory/30 text-ivory px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-all duration-300"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
