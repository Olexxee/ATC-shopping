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
import { mapProductsToCards } from "../../mappers/product.mapper";
import { mapCategoriesToCards } from "../../mappers/category.mapper";
import { mapBrandsToCards } from "../../mappers/brand.mapper";



export function HomePage() {
  const { categories, brands, featured, newArrivals, bestSellers } =
    useHomepageData();

  const categoryCards = mapCategoriesToCards(categories);

  const brandCards = mapBrandsToCards(brands);

  const featuredProducts = mapProductsToCards(featured);

  const newArrivalProducts = mapProductsToCards(newArrivals);

  const bestSellerProducts = mapProductsToCards(bestSellers);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HeroSection slides={[]} />

        <CategorySection categories={categoryCards} />

        <FeaturedProductsSection products={featuredProducts} />

        <ImportationBanner />

        <BrandsSection brands={brandCards} />

        <NewArrivalsSection products={newArrivalProducts} />

        <BestSellersSection products={bestSellerProducts} />
      </main>

      <Footer />
    </div>
  );
}
