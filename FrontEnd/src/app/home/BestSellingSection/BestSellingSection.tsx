"use client";
import React, { useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import {ProductCardResponse} from "@/api/product-api";

const BestSellingSection: React.FC = () => {
  const [products] = useState<ProductCardResponse[]>([]);

  return (
    <div className="flex-col flex">
      <h2 className="text-xl md:text-2xl font-semibold mb-2 self-center">
        Best Selling
      </h2>
      <p className="mb-12 self-center text-center">
        Discover the products everyone’s obsessed with, handpicked for you to
        enjoy before they’re gone!
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSellingSection;
