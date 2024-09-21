"use client";

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
import { Product, User } from "./homeComponents/types";

const HomePage: React.FC = () => {
  axios.defaults.withCredentials = true;
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/profile"
        );
        setUser(response.data);
        //fetchWishlist();
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    //fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(
          `Failed to load products: ${error.response.status} ${error.response.statusText}`
        );
      } else {
        setError("Failed to load products. Please try again later.");
      }
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/wishlist");
      setWishlist(response.data.map((item: { id: number }) => item.id));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const toggleWishlist = async (productId: number) => {
    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`http://localhost:8080/api/wishlist/${productId}`);
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post("http://localhost:8080/api/wishlist", { productId });
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const addToCart = (productId: number) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: number) => {
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
      const product = products.find((p) => p.id === Number(productId));
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
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
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
