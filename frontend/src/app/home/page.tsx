"use client";

import React from "react";
import FeaturesSection from "./homeComponents/FeaturesSection";
import Footer from "./homeComponents/Footer";
import HeroSection from "./homeComponents/HeroSection";
import Navbar from "./homeComponents/navbar";
import ProductList from "./homeComponents/ProductList";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
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
