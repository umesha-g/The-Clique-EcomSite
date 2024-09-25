"use client";
import { fetchSellerProducts } from "@/api/products";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Navbar from "./dashboardComponents/navBar";
import ProductList from "./dashboardComponents/productList";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split("=")[1];
    if (!token) {
      router.push("/login");
    } else {
      fetchProducts();
    }
  }, [router]);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await fetchSellerProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    }
  };

  const handleAddProduct = () => {
    router.push("/dashboard/addorModifyProduct");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar title="Seller Dashboard" />
      <main className="container mx-auto p-4 pt-20">
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
        )}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Product
          </button>
        </div>
        <ProductList products={products} onProductUpdate={fetchProducts} />
      </main>
    </div>
  );
};

export default Dashboard;
