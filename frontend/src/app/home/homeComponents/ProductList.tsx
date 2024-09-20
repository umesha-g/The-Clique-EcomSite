// homeComponents/ProductList.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="dark:bg-gray-950">
            <CardHeader className="relative h-48">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl font-semibold mb-1 dark:text-white">
                {product.name}
              </CardTitle>
              <p className="text-gray-400 mb-4">{product.seller.fullName}</p>
              <p className="text-gray-400 mb-4">{product.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold dark:text-white">
                  {product.price} USD
                </span>
                <Button
                  variant={"default"}
                  onClick={() => onToggleWishlist(product.id)}
                  className="px-4 py-2 rounded-lg"
                >
                  <FaHeart
                    className={
                      wishlist.includes(product.id)
                        ? "text-red-700"
                        : "text-gray-200 dark:text-gray-900 "
                    }
                  />
                </Button>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => onAddToCart(product.id)}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
