"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart, FaSearch } from "react-icons/fa";

interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  isNewUser: boolean;
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
  const [isNewUser, setIsNewUser] = useState(true);
  const router = useRouter();
  const [errorOf, setError] = useState<string | null>(null);

  useEffect(() => {
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

    const token = localStorage.getItem("token");
    if (!token) {
      setIsNewUser(true);
    } else {
      setIsNewUser(false);
    }

    fetchProducts();
  }, [isNewUser, router]);

  const goToLogin = () => {
    router.push("/login");
  };

  const goToHome = () => {
    router.push("/home");
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

            <div className="text-sm">
              <Button
                onClick={() => {
                  router.push("/login");
                }}
                className="ml-2"
              >
                Login/Register
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {isNewUser ? (
        <div className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            Welcome to our store! Start shopping by browsing our products below.
          </div>
        </div>
      ) : (
        `${goToHome()} `
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
                  <Button
                    className={`px-4 py-2 rounded-lg `}
                    onClick={goToLogin}
                  >
                    <FaHeart className={`text-xl `} />
                  </Button>
                </div>
                <Button
                  className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500"
                  onClick={goToLogin}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
