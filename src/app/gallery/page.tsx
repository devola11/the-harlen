"use client";

import { useState, useEffect, useCallback } from "react";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";

type CategorySlug = "suites" | "living" | "bathrooms" | "views";
type Tab = "All" | "Suites" | "Living Spaces" | "Bathrooms" | "Views";

type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  category: CategorySlug;
};

const IMAGES: GalleryImage[] = [
  // Suites (8)
  // SUITES (8)
  { id: 1, src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85", alt: "Luxury suite", category: "suites" },
  { id: 2, src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=85", alt: "Studio suite", category: "suites" },
  { id: 3, src: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&q=85", alt: "One bedroom living", category: "suites" },
  { id: 4, src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85", alt: "Penthouse suite", category: "suites" },
  { id: 5, src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=85", alt: "Suite living area", category: "suites" },
  { id: 6, src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85", alt: "Modern kitchen", category: "suites" },
  { id: 7, src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85", alt: "Luxury residence", category: "suites" },
  { id: 8, src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=85", alt: "Suite interior", category: "suites" },

  // LIVING SPACES (8)
  // id 9 fallback — original 1586023492125-27b2c045efd3 returned 404
  { id: 9, src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=85", alt: "Kitchen and dining", category: "living" },
  { id: 10, src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=85", alt: "Modern interior", category: "living" },
  // id 11 fallback — original 1600210492493-0e4d00f4f7a8 returned 404
  { id: 11, src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=85", alt: "Open living space", category: "living" },
  { id: 12, src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=85", alt: "Living room", category: "living" },
  { id: 13, src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85", alt: "Contemporary living", category: "living" },
  { id: 14, src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=85", alt: "Apartment interior", category: "living" },
  { id: 15, src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85", alt: "Lounge area", category: "living" },
  { id: 16, src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=85", alt: "Dining space", category: "living" },

  // BATHROOMS (4)
  { id: 17, src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85", alt: "Luxury bathroom", category: "bathrooms" },
  { id: 18, src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85", alt: "Marble bathroom", category: "bathrooms" },
  { id: 19, src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=85", alt: "Modern bathroom", category: "bathrooms" },
  { id: 20, src: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=85", alt: "Spa bathroom", category: "bathrooms" },

  // VIEWS (4)
  { id: 21, src: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&q=85", alt: "Central Park aerial", category: "views" },
  { id: 22, src: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=85", alt: "NYC skyline", category: "views" },
  { id: 23, src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=85", alt: "Manhattan view", category: "views" },
  // id 24 fallback — original 1496442226-0b1f1fb7a0dc returned 404
  { id: 24, src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=85", alt: "City at night", category: "views" },
];

const TABS: Tab[] = ["All", "Suites", "Living Spaces", "Bathrooms", "Views"];

// Maps each tab label to the matching category slug on the images.
const TAB_CATEGORY: Record<Exclude<Tab, "All">, CategorySlug> = {
  Suites: "suites",
  "Living Spaces": "living",
  Bathrooms: "bathrooms",
  Views: "views",
};

// Lightbox uses a higher-resolution variant of the same photo.
const hiRes = (url: string) => url.replace("w=800", "w=1600");

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = IMAGES.filter(
    (img) => activeTab === "All" || img.category === TAB_CATEGORY[activeTab],
  );

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? i : (i - 1 + visible.length) % visible.length,
      ),
    [visible.length],
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % visible.length)),
    [visible.length],
  );

  // Keyboard navigation for the lightbox.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, close, prev, next]);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[40vh] overflow-hidden bg-charcoal">
        <div className="flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16 pt-32 h-full">
          <p className="font-dm-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
            The Harlen
          </p>
          <h1 className="font-cormorant text-[64px] md:text-[80px] lg:text-[100px] font-light italic text-ivory leading-none">
            Gallery.
          </h1>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-cream sticky top-[72px] z-30 border-b border-linen px-6 md:px-12 lg:px-24 py-0">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-dm-sans text-[11px] tracking-[0.15em] uppercase whitespace-nowrap bg-transparent border-none cursor-pointer transition-colors ${
                  active
                    ? "text-charcoal border-b-2 border-gold"
                    : "text-ash hover:text-charcoal"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-cream px-6 md:px-12 lg:px-24 py-12">
        <div className="gallery-grid columns-1 sm:columns-2 lg:columns-3 gap-4">
          {visible.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(index)}
              className="break-inside-avoid mb-4 cursor-pointer overflow-hidden group relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-auto min-h-[200px] object-cover group-hover:scale-105 transition-transform duration-700 block"
              />
              <div className="absolute inset-0 bg-obsidian/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Expand className="text-ivory w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-obsidian/95 flex items-center justify-center">
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute top-6 right-6 text-ivory/70 hover:text-ivory cursor-pointer bg-transparent border-none"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/70 hover:text-ivory bg-obsidian/50 p-2 rounded-full cursor-pointer border-none"
          >
            <ChevronLeft size={32} />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hiRes(visible[lightboxIndex].src)}
            alt={visible[lightboxIndex].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain"
          />

          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/70 hover:text-ivory bg-obsidian/50 p-2 rounded-full cursor-pointer border-none"
          >
            <ChevronRight size={32} />
          </button>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-dm-sans text-[12px] text-ivory/50">
            {lightboxIndex + 1} / {visible.length}
          </p>
        </div>
      )}
    </main>
  );
}
