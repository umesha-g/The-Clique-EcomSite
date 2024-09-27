import ProductCard from "@/app/commonComponents/productCard";
import React from "react";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  seller: User;
  imageUrl: string;
}

interface ProductListProps {
  products: Product[];
  error: string | null;
}

const ProductList: React.FC<ProductListProps> = ({ products, error }) => {
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
