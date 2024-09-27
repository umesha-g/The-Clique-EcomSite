"use client";
import { fetchAllProducts } from "@/api/products";
import ProductList from "@/app/home/homeComponents/ProductList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "./footer";
import HeroSection from "./hero";
import NavBar from "./navbar";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  seller: User;
  imageUrl: string;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await fetchAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  return (
    <div className="relative">
      <NavBar />
      <section className="bg-beige-200 dark:bg-gray-900 min-h-screen relative">
        <HeroSection />
      </section>
      <section className="bg-white dark:bg-gray-950 min-h-screen relative">
        <ProductList products={products} error={error} />
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
