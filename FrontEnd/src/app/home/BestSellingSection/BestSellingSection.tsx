import { getAllProducts } from "@/api/admin/admin-product-api";
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

const BestSellingSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();


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
