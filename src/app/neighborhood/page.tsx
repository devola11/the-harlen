import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Train, Car, Plane, type LucideIcon } from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";

export const metadata: Metadata = {
  title: "Neighborhood",
  description:
    "The Upper West Side — Central Park, world-class museums, and Manhattan's finest dining, steps from The Harlen at 22 West 76th Street.",
};

type Landmark = {
  name: string;
  distance: string;
  walk: string;
  desc: string;
};

const LANDMARKS: Landmark[] = [
  {
    name: "Central Park",
    distance: "0.2 miles",
    walk: "2 min walk",
    desc: "New York's greatest park — row boats on the lake, Shakespeare in the Park, and 843 acres of green in the heart of Manhattan.",
  },
  {
    name: "American Museum of Natural History",
    distance: "0.3 miles",
    walk: "4 min walk",
    desc: "One of the world's great museums, with 45 permanent halls including the celebrated Rose Center for Earth and Space.",
  },
  {
    name: "Lincoln Center",
    distance: "0.8 miles",
    walk: "10 min walk",
    desc: "Home to the New York Philharmonic, the Metropolitan Opera, and the New York City Ballet — the cultural crown of the Upper West Side.",
  },
  {
    name: "Columbus Circle",
    distance: "1.1 miles",
    walk: "13 min walk",
    desc: "Gateway to Midtown, home to Whole Foods, the Time Warner Center, and the south-western entrance to Central Park.",
  },
  {
    name: "Riverside Park",
    distance: "0.5 miles",
    walk: "6 min walk",
    desc: "A quieter, more contemplative green space stretching four miles along the Hudson River — perfect for morning runs and evening strolls.",
  },
  {
    name: "The Metropolitan Museum of Art",
    distance: "1.4 miles",
    walk: "18 min walk",
    desc: "The largest art museum in the Western Hemisphere — over two million works spanning 5,000 years of human creativity.",
  },
];

const DINING: { name: string; meta: string }[] = [
  { name: "Dovetail", meta: "Modern American · 0.2 miles" },
  { name: "Jacob's Pickles", meta: "Southern Comfort · 0.3 miles" },
  { name: "Ouest", meta: "Contemporary Brasserie · 0.4 miles" },
  { name: "Barney Greengrass", meta: "Historic Deli · 0.5 miles" },
  { name: "Saiguette", meta: "Vietnamese · 0.2 miles" },
];

const SHOPPING: { name: string; meta: string }[] = [
  { name: "Zabar's", meta: "Iconic NYC Food Market · 0.4 miles" },
  { name: "Book Culture", meta: "Independent Bookshop · 0.3 miles" },
  { name: "Citarella", meta: "Gourmet Grocer · 0.3 miles" },
  { name: "Greenmarket", meta: "Farmers Market (Sundays) · 0.5 miles" },
  { name: "Equinox", meta: "Premium Fitness · 0.2 miles" },
];

type Transit = {
  icon: LucideIcon;
  mode: string;
  detail: string;
  sub: string;
};

const TRANSIT: Transit[] = [
  {
    icon: Train,
    mode: "By Subway",
    detail: "B/C — 81st St Station",
    sub: "2 minute walk from The Harlen's front door. Also: 1 train — 79th St (5 min walk).",
  },
  {
    icon: Car,
    mode: "By Car / Rideshare",
    detail: "Available 24/7",
    sub: "Uber, Lyft, and taxi available around the clock. The concierge can arrange car service.",
  },
  {
    icon: Plane,
    mode: "From JFK Airport",
    detail: "~45 minutes by car",
    sub: "Concierge car service available from $85. AirTrain + E/A/C subway also available.",
  },
  {
    icon: Plane,
    mode: "From LaGuardia",
    detail: "~30 minutes by car",
    sub: "Concierge car service available from $65. M60 bus to subway also available.",
  },
];

export default function NeighborhoodPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1920&q=90"
          alt="The Upper West Side, Manhattan"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-obsidian/50" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16 pt-32">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            22 West 76th Street · Manhattan
          </p>
          <h1 className="font-cormorant text-[64px] md:text-[80px] lg:text-[100px] font-light italic text-ivory leading-none">
            The Upper West Side.
          </h1>
          <p className="mt-6 max-w-[560px] font-dm-sans text-[16px] text-ivory/75 font-light">
            One of New York&apos;s most beloved and culturally rich
            neighbourhoods — steps from Central Park, world-class museums, and
            Manhattan&apos;s finest dining.
          </p>
        </div>
      </section>

      {/* Editorial */}
      <section className="bg-cream py-24 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold">
              The Neighbourhood
            </p>
            <h2 className="font-cormorant text-[40px] md:text-[52px] font-light text-charcoal italic leading-tight mt-4">
              Culture, nature,
              <br />
              and the city at
              <br />
              your door.
            </h2>
            <div className="w-16 h-px bg-gold my-8" />
            <div className="space-y-4 font-dm-sans text-[16px] text-ash leading-loose">
              <p>
                The Upper West Side is not merely a neighbourhood — it is a
                declaration of taste. Stretching along the western edge of
                Central Park from 59th to 110th Street, it is home to some of
                New York&apos;s most distinguished residents, finest brownstone
                architecture, and most storied cultural institutions.
              </p>
              <p>
                From The Harlen&apos;s address on West 76th Street, Central Park
                is a two-minute walk. The American Museum of Natural History is
                four. Lincoln Center — home to the New York Philharmonic and the
                Metropolitan Opera — is ten minutes on foot.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1} className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=85"
              alt="Upper West Side brownstones"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </FadeUp>
        </div>
      </section>

      {/* Landmarks */}
      <section className="bg-charcoal py-24 px-6 md:px-12 lg:px-24">
        <FadeUp className="text-center mb-16">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            Nearby
          </p>
          <h2 className="font-cormorant text-[40px] md:text-[56px] text-ivory italic font-light">
            Steps from everything.
          </h2>
        </FadeUp>

        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LANDMARKS.map((l) => (
              <div
                key={l.name}
                className="bg-graphite p-8 hover:bg-obsidian border border-graphite hover:border-gold/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6 gap-4">
                  <h3 className="font-cormorant text-[24px] text-ivory font-medium leading-tight">
                    {l.name}
                  </h3>
                  <span className="font-dm-sans text-[11px] text-gold tracking-[0.1em] bg-gold/10 px-3 py-1 whitespace-nowrap">
                    {l.distance}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={14} className="text-gold" />
                  <span className="font-dm-sans text-[12px] text-ivory/50">
                    {l.walk}
                  </span>
                </div>
                <p className="font-dm-sans text-[13px] text-ivory/60 leading-relaxed">
                  {l.desc}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* Dining & Shopping */}
      <section className="bg-ivory py-24 px-6 md:px-12 lg:px-24">
        <FadeUp>
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            Local Favourites
          </p>
          <h2 className="font-cormorant text-[40px] md:text-[48px] text-charcoal italic font-light">
            The best of the Upper West Side.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <FadeUp>
            <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-6">
              Dining
            </p>
            <ul className="space-y-6">
              {DINING.map((d) => (
                <li key={d.name} className="flex flex-col">
                  <span className="font-cormorant text-[20px] text-charcoal font-medium">
                    {d.name}
                  </span>
                  <span className="font-dm-sans text-[12px] text-ash">
                    {d.meta}
                  </span>
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-6">
              Shopping
            </p>
            <ul className="space-y-6">
              {SHOPPING.map((s) => (
                <li key={s.name} className="flex flex-col">
                  <span className="font-cormorant text-[20px] text-charcoal font-medium">
                    {s.name}
                  </span>
                  <span className="font-dm-sans text-[12px] text-ash">
                    {s.meta}
                  </span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* Getting Here */}
      <section className="bg-cream py-24 px-6 md:px-12 lg:px-24">
        <FadeUp>
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            Getting Here
          </p>
          <h2 className="font-cormorant text-[40px] text-charcoal italic font-light">
            Arriving at The Harlen.
          </h2>
        </FadeUp>

        <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {TRANSIT.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.mode}
                  className="p-8 bg-ivory border border-linen"
                >
                  <Icon size={32} className="text-gold mb-4" />
                  <p className="font-dm-sans text-[10px] tracking-[0.2em] text-gold uppercase mb-3">
                    {t.mode}
                  </p>
                  <p className="font-dm-sans text-[14px] text-charcoal font-medium mb-2">
                    {t.detail}
                  </p>
                  <p className="font-dm-sans text-[13px] text-ash leading-relaxed">
                    {t.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </FadeUp>
      </section>

      {/* Map */}
      <section className="bg-charcoal py-16 px-6 md:px-12 lg:px-24">
        <FadeUp>
          <h2 className="font-cormorant text-[28px] text-ivory font-light italic mb-2">
            22 West 76th Street, Upper West Side
          </h2>
          <p className="font-dm-sans text-[13px] text-ivory/50 mb-8">
            New York, NY 10023
          </p>

          <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
            <iframe
              title="Map of The Harlen, 22 West 76th Street"
              src="https://www.google.com/maps?q=22+West+76th+Street,+New+York,+NY+10023&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          <a
            href="mailto:reservations@theharlen.com"
            className="inline-block font-dm-sans text-[12px] text-gold tracking-[0.1em] hover:text-gold-light transition-colors mt-6"
          >
            Let our concierge arrange your arrival transfer →
          </a>
        </FadeUp>
      </section>
    </main>
  );
}
