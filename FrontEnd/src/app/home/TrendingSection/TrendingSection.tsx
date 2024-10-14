import { getAllProducts } from "@/api/product-api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  cardImageUrl: string;
  purchaseCount: number;
  stock: number;
}

const TrendingSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts.content);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
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
