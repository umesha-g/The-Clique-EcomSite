import ProductCard from "@/app/commonComponents/ProductCard";
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
  //wishlist: string[];
  //onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  error: string | null;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  //wishlist,
  //onToggleWishlist,
  onAddToCart,
  error,
}) => {
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            //isInWishlist={wishlist.includes(product.id)}
            //onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
