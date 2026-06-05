import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import SuitesPreview from "@/components/home/SuitesPreview";
import AmenitiesStrip from "@/components/home/AmenitiesStrip";
import NeighborhoodTeaser from "@/components/home/NeighborhoodTeaser";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IntroSection />
      <SuitesPreview />
      <AmenitiesStrip />
      <NeighborhoodTeaser />
      <TestimonialsSection />
    </main>
  );
}
