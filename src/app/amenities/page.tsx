import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PhoneCall,
  Sparkles,
  Shirt,
  ShoppingBag,
  Package,
  Star,
  Dumbbell,
  Heart,
  Droplets,
  Moon,
  Wifi,
  Briefcase,
  Monitor,
  Headphones,
  Coffee,
  ChefHat,
  Film,
  Armchair,
  UtensilsCrossed,
  Shield,
  Key,
  Car,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import FadeUp from "@/components/ui/FadeUp";

export const metadata: Metadata = {
  title: "Amenities",
  description:
    "Thoughtful amenities and around-the-clock service at The Harlen — concierge, wellness, connectivity, dining, and security on Manhattan's Upper West Side.",
};

type Amenity = { icon: LucideIcon; name: string; desc: string };
type Category = {
  label: string;
  title: string;
  bg: "bg-ivory" | "bg-cream";
  items: Amenity[];
};

const CATEGORIES: Category[] = [
  {
    label: "Residence Services",
    title: "Residence Services",
    bg: "bg-ivory",
    items: [
      {
        icon: PhoneCall,
        name: "24/7 Concierge",
        desc: "Our concierge team is available around the clock to assist with reservations, recommendations, and every request.",
      },
      {
        icon: Sparkles,
        name: "Daily Housekeeping",
        desc: "Optional daily or weekly housekeeping — linens changed, surfaces cleaned, and your space refreshed to hotel standard.",
      },
      {
        icon: Shirt,
        name: "Valet Laundry",
        desc: "Same-day laundry and dry cleaning collected from your door and returned pressed and folded.",
      },
      {
        icon: ShoppingBag,
        name: "Grocery Delivery",
        desc: "Pre-arrival pantry stocking and on-demand grocery delivery from Manhattan's finest suppliers.",
      },
      {
        icon: Package,
        name: "Package Handling",
        desc: "All parcels received, logged, and delivered directly to your suite — 24 hours a day.",
      },
      {
        icon: Star,
        name: "Evening Turndown",
        desc: "Nightly turndown service with fresh amenities, soft lighting, and bedding prepared for rest.",
      },
    ],
  },
  {
    label: "Wellness & Fitness",
    title: "Wellness & Fitness",
    bg: "bg-cream",
    items: [
      {
        icon: Dumbbell,
        name: "Technogym Fitness Center",
        desc: "A fully equipped private gym featuring Technogym cardio and strength equipment, open 24 hours.",
      },
      {
        icon: Heart,
        name: "Yoga & Stretching Studio",
        desc: "A dedicated quiet space for yoga, meditation, and stretching — available by booking.",
      },
      {
        icon: Droplets,
        name: "Spa Services on Request",
        desc: "In-residence massage and spa treatments arranged by the concierge with vetted Manhattan therapists.",
      },
      {
        icon: Moon,
        name: "Sleep Concierge",
        desc: "Pillow menu, blackout solutions, white noise, and sleep-enhancing amenity kits on request.",
      },
    ],
  },
  {
    label: "Work & Connectivity",
    title: "Work & Connectivity",
    bg: "bg-ivory",
    items: [
      {
        icon: Wifi,
        name: "High-Speed WiFi",
        desc: "Complimentary gigabit WiFi throughout every residence — fast enough for video calls, large transfers, and streaming.",
      },
      {
        icon: Briefcase,
        name: "Business Center",
        desc: "Printing, scanning, dedicated workstations, and private meeting rooms available to all residents.",
      },
      {
        icon: Monitor,
        name: "Smart Home Controls",
        desc: "Climate, lighting, and entertainment controlled from a single panel or your personal device.",
      },
      {
        icon: Headphones,
        name: "Premium Sound System",
        desc: "Sonos or Bose audio systems in select suites — ask the concierge for availability.",
      },
    ],
  },
  {
    label: "Dining & Social",
    title: "Dining & Social",
    bg: "bg-cream",
    items: [
      {
        icon: Coffee,
        name: "The Harlen Café",
        desc: "Our ground-floor café serves specialty coffee, pastries, and light meals — the perfect start to a New York morning.",
      },
      {
        icon: ChefHat,
        name: "Gourmet Kitchen",
        desc: "Every suite features a fully equipped kitchen with premium appliances, cookware, and tableware.",
      },
      {
        icon: Film,
        name: "Private Cinema",
        desc: "A residents-only screening room for film nights, sports, and private presentations.",
      },
      {
        icon: Armchair,
        name: "Residents Lounge",
        desc: "A curated evening social space for networking, reading, and quiet conversation.",
      },
      {
        icon: UtensilsCrossed,
        name: "In-Room Dining",
        desc: "Restaurant-quality dining delivered to your suite from The Harlen's culinary partners.",
      },
    ],
  },
  {
    label: "Security & Access",
    title: "Security & Access",
    bg: "bg-ivory",
    items: [
      {
        icon: Shield,
        name: "24/7 Security",
        desc: "Uniformed doormen, CCTV coverage, and a secure building access system — around the clock.",
      },
      {
        icon: Key,
        name: "Keycard Access",
        desc: "Personalised keycard access to your floor, suite, amenity spaces, and building entrances.",
      },
      {
        icon: Car,
        name: "Valet Parking",
        desc: "Valet parking available for residents with vehicles — contact the concierge for rates and availability.",
      },
      {
        icon: MapPin,
        name: "Prime Location",
        desc: "Steps from Central Park, top-tier restaurants, and Manhattan's finest cultural institutions.",
      },
    ],
  },
];

export default function AmenitiesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=90"
          alt="The Harlen amenities"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-obsidian/55" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16 pt-32">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            The Harlen
          </p>
          <h1 className="font-cormorant text-[64px] md:text-[80px] lg:text-[100px] font-light italic text-ivory leading-none">
            Thoughtful Amenities.
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-cream py-20 px-6 md:px-12 lg:px-24">
        <FadeUp className="max-w-[800px] mx-auto text-center">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-6">
            Our Services
          </p>
          <h2 className="font-cormorant text-[36px] md:text-[48px] font-light text-charcoal italic mb-6">
            Every detail. Every day.
          </h2>
          <p className="font-dm-sans text-[16px] text-ash leading-loose">
            At The Harlen, service is not an afterthought — it is the
            foundation. From the moment you arrive, every element of your
            residence is managed, maintained, and elevated by a team dedicated
            to one thing: your comfort.
          </p>
        </FadeUp>
      </section>

      {/* Categories */}
      {CATEGORIES.map((cat) => (
        <section
          key={cat.title}
          className={`${cat.bg} py-20 px-6 md:px-12 lg:px-24`}
        >
          <FadeUp>
            <header className="mb-12">
              <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
                {cat.label}
              </p>
              <h2 className="font-cormorant text-[40px] md:text-[52px] font-light text-charcoal">
                {cat.title}
              </h2>
              <div className="w-16 h-px bg-gold mt-6" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cat.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="p-8 border border-linen hover:border-gold/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Icon size={28} className="text-gold mb-4" />
                    <h3 className="font-cormorant text-[22px] text-charcoal font-medium mb-2">
                      {item.name}
                    </h3>
                    <p className="font-dm-sans text-[14px] text-ash leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </FadeUp>
        </section>
      ))}

      {/* Bottom CTA */}
      <section className="bg-charcoal py-24 text-center px-6">
        <FadeUp>
          <h2 className="font-cormorant text-[40px] md:text-[48px] text-ivory italic font-light">
            Ready to make The Harlen home?
          </h2>
          <p className="font-dm-sans text-[15px] text-ivory/60 mt-4">
            Every amenity. Every service. Every day.
          </p>
          <Link
            href="/reserve"
            className="inline-block mt-10 bg-gold text-obsidian px-10 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all"
          >
            Reserve Your Suite
          </Link>
        </FadeUp>
      </section>
    </main>
  );
}
