"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart, FaSearch, FaShoppingCart } from "react-icons/fa";

interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  isNewUser: boolean; // Assuming you have this property
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: User;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [errorOf, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

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
        // Fetch wishlist
        fetchWishlist(token);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

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

    if (!token) {
      router.push("/login");
    } else {
      fetchUserProfile(token);
      fetchProducts();
    }
  }, [router]);

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
    // Implement your payment gateway integration here
    alert("Proceeding to payment gateway...");
    setIsCheckoutOpen(true);
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 left-0 right-0 ">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Our Store</h1>
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-indigo-600 rounded-lg"
              onClick={goToDashboard}
            >
              Dashboard
            </button>
            <button
              className="px-4 py-2 bg-indigo-600 rounded-lg"
              onClick={goToProfile}
            >
              Profile
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative">
              <FaShoppingCart className="text-2xl" />
              {Object.keys(cart).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {Object.values(cart).reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
            {user && (
              <div className="text-sm">
                Welcome, {user.fullName}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                  }}
                  className="ml-2 text-red-500 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isNewUser && (
        <div className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            Welcome to our store! Start shopping by browsing our products below.
          </div>
        </div>
      )}

      <main className="container mx-auto p-4">
        <p>{errorOf}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
                <p className="text-gray-400 mb-4">{product.seller.fullName}</p>
                <p className="text-gray-400 mb-4">{product.description}</p>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    {product.price} USD
                  </span>
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      wishlist.includes(product.id)
                        ? "bg-red-600"
                        : "bg-blue-600"
                    }`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <FaHeart
                      className={`text-xl ${
                        wishlist.includes(product.id)
                          ? "text-white"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                </div>
                <button
                  className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center bg-gray-800 text-white">
          <div className="container relative bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
            <ul>
              {Object.keys(cart).map((productId) => {
                const product = products.find(
                  (p) => p.id === Number(productId)
                );
                return (
                  <li
                    key={productId}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>{product?.name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(Number(productId))}
                        className="bg-red-600 px-2 py-1 rounded-lg"
                      >
                        -
                      </button>
                      <span>{cart[productId]}</span>
                      <button
                        onClick={() => addToCart(Number(productId))}
                        className="bg-green-600 px-2 py-1 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xl font-bold">
                Total: {getTotalPrice()} USD
              </span>
              <button
                onClick={handleCheckout}
                className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500"
              >
                Checkout
              </button>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="absolute top-2 right-2 text-red-500 text-2xl"
            >
              x
            </button>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white text-black p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            <p>Proceeding to payment gateway...</p>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
