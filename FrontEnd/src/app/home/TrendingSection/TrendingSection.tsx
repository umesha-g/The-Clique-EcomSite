import React, { useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import {ProductCardResponse} from "@/api/product-api";

const TrendingSection: React.FC = () => {
  const [products] = useState<ProductCardResponse[]>([]);

  return (
    <div className=" flex-col flex">
      <h2 className="text-xl md:text-2xl font-semibold mb-2 self-center ">
        Trending Outfits
      </h2>
      <p className="mb-12 self-center  text-center">
        Stay ahead of the game with trending products that are defining what’s
        hot right now.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
