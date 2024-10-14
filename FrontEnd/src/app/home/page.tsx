"use client";
import BestSellingSection from "./BestSellingSection/BestSellingSection";
import FeaturedSection from "./FeaturedSection/FeaturedSection";
import HomeFooter from "./Footer/Footer";
import HomeHeader from "./Header/Header";
import HeroSection from "./HeroSection/HeroSection";
import TestimonialSection from "./TesimonialSection/TestimonialSection";
import TrendingSection from "./TrendingSection/TrendingSection";

const HomePage = () => {
  return (
    <div className="min-h-screen text-gray-600 bg-white">
      <HomeHeader />

      <main className="relative">
        <section>
          <HeroSection />
        </section>

        <section className="relative md:-top-32 lg:-top-48 left-0 right-0 z-20">
          <FeaturedSection />
        </section>

        <section className="container relative md:-top-28 lg:-top-40 left-0 right-0 mx-auto px-4 py-12">
          <BestSellingSection />
        </section>

        <section className="relative md:-top-24 lg:-top-28 left-0 right-0 mx-auto ">
          <TestimonialSection />
        </section>

        <section className="container relative md:-top-20 lg:-top-16 left-0 right-0 mx-auto px-4 py-12">
          <TrendingSection />
        </section>
      </main>

      <footer className="py-8 bg-neutral-800">
        <HomeFooter />
      </footer>
    </div>
  );
};

export default HomePage;
