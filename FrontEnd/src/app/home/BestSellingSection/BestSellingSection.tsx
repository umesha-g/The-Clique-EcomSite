"use client";
import React, {useEffect, useState} from "react";
import ProductCard from "@/app/components/ProductCard";
import {getBestSellingProducts, ProductCardResponse} from "@/api/product-api";
import ProductGrid from "@/app/components/ProductGrid";

const BestSellingSection: React.FC = () => {
  const [products,setProducts] = useState<ProductCardResponse[]>([]);
  const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getBestSellingProducts();
            setProducts(response);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


  return (
    <div className="flex-col flex p-4 border">
      <h2 className="text-xl md:text-2xl font-semibold mb-2 self-center text-balance text-center">
        Best Selling
      </h2>
      <p className="mb-12 self-center text-center">
        Discover the products everyone’s obsessed with, handpicked for you to
        enjoy before they’re gone!
      </p>
      <div className={""}>
          <ProductGrid
              products={products}
              loading={loading}
              cols={"grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"}
              gap={"gap-2 md:gap-4"}
          />
      </div>
    </div>
  );
};

export default BestSellingSection;
