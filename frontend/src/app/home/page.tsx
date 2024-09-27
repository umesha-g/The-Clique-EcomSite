"use client";

import { fetchAllProducts } from "@/api/products";
import { fetchUserProfile } from "@/api/users";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CartButtonWithPanel from "../commonComponents/cartButtonWithPanel";
import FeaturesSection from "./homeComponents/FeaturesSection";
import Footer from "./homeComponents/Footer";
import Header from "./homeComponents/Header";
import HeroSection from "./homeComponents/HeroSection";
import ProductList from "./homeComponents/ProductList";

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
  const [searchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
    loadProducts();
  }, [router]);

  const loadUserProfile = async () => {
    try {
      const userProfile = await fetchUserProfile();
      setUser(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const fetchedProducts = await fetchAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/users/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header user={user} onLogout={handleLogout} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProductList products={filteredProducts} error={error} />
        <CartButtonWithPanel />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
