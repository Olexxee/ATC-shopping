import { Header } from "../../components/header/Header";
import { HeroSection } from "../../components/Hero/HeroSection";
import { CategorySection } from "../../components/home/CategorySection";
import { FeaturedProductsSection } from "../../components/home/FeaturedProductsSection";
import { ImportationBanner } from "../../components/home/ImportationBanner";
import { BrandsSection } from "../../components/home/BrandsSection";
import { NewArrivalsSection } from "../../components/home/NewArrivalsSection";
import { BestSellersSection } from "../../components/home/BestSellersSection";
import { Footer } from "../../components/footer/Footer";
import { useHomepageData } from "../../features/home/useHomepageProducts";
import { mapCategoriesToCards } from "../../mappers/category.mapper";
import { mapBrandsToCards } from "../../mappers/brand.mapper";

export function HomePage() {
  const { hero, categories, brands, featured, newArrivals, bestSellers } =
    useHomepageData();

  const categoryCards = mapCategoriesToCards(categories);
  const brandCards = mapBrandsToCards(brands);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HeroSection slides={hero} />

        <CategorySection categories={categoryCards} />

        <FeaturedProductsSection products={featured} />

        <ImportationBanner />

        <BrandsSection brands={brandCards} />

        <NewArrivalsSection products={newArrivals} />

        <BestSellersSection products={bestSellers} />
      </main>

      <Footer />
    </div>
  );
}
