"use client";

import { fetchAllProducts } from "@/api/products";
import { fetchUserProfile } from "@/api/users";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cart from "./homeComponents/Cart";
import Checkout from "./homeComponents/Checkout";
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
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const addToCart = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.id === String(productId));
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
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
      <Header
        user={user}
        cartItemCount={Object.values(cart).reduce((a, b) => a + b, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onLogout={handleLogout}
      />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProductList
          products={filteredProducts}
          onAddToCart={addToCart}
          error={error}
        />
      </main>
      <Footer />
      {isCartOpen && (
        <Cart
          cart={cart}
          products={products}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          getTotalPrice={getTotalPrice}
        />
      )}
      {isCheckoutOpen && <Checkout onClose={() => setIsCheckoutOpen(false)} />}
    </div>
  );
};

export default HomePage;
