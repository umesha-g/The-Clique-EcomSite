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
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async (token: string) => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setIsNewUser(response.data.isNewUser);
        fetchWishlist(token);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchUserProfile(token);
      fetchProducts();
    }
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

  const fetchWishlist = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:8080/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data.map((item: { id: number }) => item.id));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`http://localhost:8080/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(
          "http://localhost:8080/api/wishlist",
          { productId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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
        {isNewUser && (
          <div className="bg-blue-600 text-white p-4">
            <div className="container mx-auto">
              Welcome to our store! Start shopping by browsing our products
              below.
            </div>
          </div>
        )}
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
