import type { HeroSlideData } from "../types/homepage-ui";
import type { HeroSlideApi } from "../types/business-config";

export function mapHeroSlide(slide: HeroSlideApi): HeroSlideData {
  return {
    id: slide.id,
    eyebrow: slide.eyebrow ?? undefined,
    title: slide.title,
    description: slide.description ?? undefined,
    image: slide.image,
    mobileImage: slide.mobileImage ?? undefined,
    href: slide.href,
    actionLabel: slide.actionLabel ?? undefined,
    alignment: slide.alignment ?? "left",
  };
}

export function mapHeroSlides(slides: HeroSlideApi[]): HeroSlideData[] {
  return slides
    .filter((slide) => slide.isActive !== false)
    .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
    .map(mapHeroSlide);
}
