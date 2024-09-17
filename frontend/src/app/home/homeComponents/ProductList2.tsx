// homeComponents/ProductList.tsx
import Image from "next/image";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { Product } from "./types";

interface ProductListProps {
  products: Product[];
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (productId: number) => void;
  error: string | null;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  error,
}) => {
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
              <p className="text-gray-400 mb-4">{product.seller.fullName}</p>
              <p className="text-gray-400 mb-4">{product.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{product.price} USD</span>
                <button
                  className={`px-4 py-2 rounded-lg ${
                    wishlist.includes(product.id) ? "bg-red-600" : "bg-blue-600"
                  }`}
                  onClick={() => onToggleWishlist(product.id)}
                >
                  <FaHeart
                    className={`text-xl ${
                      wishlist.includes(product.id)
                        ? "text-white"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              </div>
              <button
                className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500"
                onClick={() => onAddToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
