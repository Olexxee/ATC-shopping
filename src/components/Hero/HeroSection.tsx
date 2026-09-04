import type { HeroSlideData } from "../../types/homepage-ui";
import { Hero } from "./Hero";

interface HeroSectionProps {
  slides: HeroSlideData[];
}

export function HeroSection({ slides }: HeroSectionProps) {
  const firstSlide = slides[0];

  if (!firstSlide) {
    return null;
  }

  return <Hero slide={firstSlide} />;
}
