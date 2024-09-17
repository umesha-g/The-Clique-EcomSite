import React from "react";
import FeaturesSection from "./homeComponents/FeaturesSection";
import Footer from "./homeComponents/Footer";
import Header from "./homeComponents/Header";
import HeroSection from "./homeComponents/HeroSection";
import ProductList from "./homeComponents/ProductList";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProductList />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
