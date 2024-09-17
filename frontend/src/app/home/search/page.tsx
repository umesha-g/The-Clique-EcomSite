"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const searchProducts = async (query: string) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/products/search?q=${encodeURIComponent(
        query
      )}`,
      {
        params: {
          query: query, // Axios handles encoding automatically
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to search products");
  }
};

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) {
      setLoading(true);
      searchProducts(q as string)
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch search results:", error);
          setLoading(false);
        });
    }
  }, [q]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results for {q}</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
              <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
      {results.length === 0 && !loading && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No results found.
        </p>
      )}
    </div>
  );
};

export default SearchResults;
