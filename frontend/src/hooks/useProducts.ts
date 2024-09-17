// hooks/useProducts.ts
import { Product } from "@/app/home/homeComponents/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  return { products, error };
};
