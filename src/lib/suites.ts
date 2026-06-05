export type SuiteData = {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  image: string;
  sizeRange: string;
  size: string;
  guests: number;
  bedType: string;
  bedrooms: number;
  bathrooms: string;
  pricePerNight: number;
  weeklyPrice: number;
  monthlyPrice: number;
  features: string[];
};

export const SUITES: SuiteData[] = [
  {
    slug: "studio-suite",
    number: "01",
    name: "Studio Suite",
    tagline: "Urban elegance in a thoughtfully curated space.",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85",
    sizeRange: "300–450",
    size: "300–450 sq ft",
    guests: 2,
    bedType: "Queen",
    bedrooms: 0,
    bathrooms: "1",
    pricePerNight: 395,
    weeklyPrice: 2499,
    monthlyPrice: 7999,
    features: [
      "Full gourmet kitchen",
      "Floor-to-ceiling windows",
      "Custom millwork storage",
      "Marble bathroom",
      "Smart TV",
      "High-speed WiFi",
      "In-suite safe",
      "Daily housekeeping available",
    ],
  },
  {
    slug: "deluxe-studio",
    number: "02",
    name: "Deluxe Studio",
    tagline: "Space, light, and luxury redefined.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85",
    sizeRange: "450–550",
    size: "450–550 sq ft",
    guests: 2,
    bedType: "King",
    bedrooms: 0,
    bathrooms: "1",
    pricePerNight: 495,
    weeklyPrice: 3199,
    monthlyPrice: 9999,
    features: [
      "King bed with luxury linens",
      "Expanded living area",
      "Premium Miele appliances",
      "Marble en-suite",
      "Curated original artwork",
      "Smart home controls",
      "Nespresso machine",
      "Designer furnishings",
    ],
  },
  {
    slug: "superior-suite",
    number: "03",
    name: "Superior Suite",
    tagline: "The hotel experience, but it's yours alone.",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85",
    sizeRange: "550–700",
    size: "550–700 sq ft",
    guests: 2,
    bedType: "King",
    bedrooms: 1,
    bathrooms: "1",
    pricePerNight: 650,
    weeklyPrice: 4199,
    monthlyPrice: 12999,
    features: [
      "Separate living room",
      "Dedicated workspace",
      "King bedroom with walk-in closet",
      "Spa bathroom with soaking tub",
      "Full kitchen",
      "Premium sound system",
      "Evening turndown",
      "City views",
    ],
  },
  {
    slug: "one-bedroom-suite",
    number: "04",
    name: "One-Bedroom Suite",
    tagline: "The art of living well in Manhattan.",
    image:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&q=85",
    sizeRange: "700–950",
    size: "700–950 sq ft",
    guests: 3,
    bedType: "King",
    bedrooms: 1,
    bathrooms: "1.5",
    pricePerNight: 850,
    weeklyPrice: 5499,
    monthlyPrice: 16999,
    features: [
      "Separate king bedroom",
      "Formal living & dining",
      "Chef kitchen with premium appliances",
      "1.5 baths",
      "Walk-in closet",
      "Office nook",
      "Floor-to-ceiling windows",
      "Daily housekeeping",
      "Premium minibar",
    ],
  },
  {
    slug: "two-bedroom-suite",
    number: "05",
    name: "Two-Bedroom Suite",
    tagline: "Luxury shared — space that brings people together.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd3?w=1200&q=85",
    sizeRange: "1,000–1,200",
    size: "1,000–1,200 sq ft",
    guests: 5,
    bedType: "King + King",
    bedrooms: 2,
    bathrooms: "2",
    pricePerNight: 1250,
    weeklyPrice: 7999,
    monthlyPrice: 24999,
    features: [
      "Two king bedrooms",
      "Two full bathrooms",
      "Large dining room seats 6",
      "Full chef kitchen",
      "Formal living room",
      "Two walk-in closets",
      "Smart home system",
      "Premium entertainment",
      "In-suite laundry",
      "Concierge priority",
    ],
  },
  {
    slug: "penthouse",
    number: "06",
    name: "The Penthouse",
    tagline: "Above the city. Above everything.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85",
    sizeRange: "1,500+",
    size: "1,500+ sq ft",
    guests: 6,
    bedType: "King + King + Queen",
    bedrooms: 3,
    bathrooms: "2.5",
    pricePerNight: 2800,
    weeklyPrice: 17999,
    monthlyPrice: 54999,
    features: [
      "Three bedrooms",
      "2.5 baths with heated floors",
      "Private wrap-around terrace",
      "Panoramic views",
      "Grand living & formal dining",
      "Chef kitchen with wine fridge",
      "Bose surround sound",
      "Butler service",
      "Private elevator access",
      "Limousine transfer",
      "Dedicated concierge 24/7",
      "Nightly turndown",
    ],
  },
];

export function getSuiteBySlug(slug: string): SuiteData | undefined {
  return SUITES.find((s) => s.slug === slug);
}
