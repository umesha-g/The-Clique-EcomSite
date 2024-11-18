"use client";

import {addToCart, CartRequest} from "@/api/cart-api";
import { useCart } from "@/contexts/cartContext";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import {Button} from "@/components/ui/button";
import {ProductResponse} from "@/api/admin/admin-product-api";

interface AddToCartButtonProps {
  product: ProductResponse;
  quantity: number;
  selectedColour:string;
  selectedSize:string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product,quantity,selectedColour,selectedSize  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCart } = useCart();

  const addItemToCart = async () => {
    setIsLoading(true);
    try {
      const productId = product.id;
      const request:CartRequest = {productId ,quantity,selectedColour,selectedSize}
      await addToCart(request);
      await refreshCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Button
          variant={"default"}
          className="rounded-none w-full h-12 text-lg"
          onClick={addItemToCart}
          disabled={isLoading || (product.stock < quantity) }
    >
          <ShoppingCart className="mr-3" size={"30"} />
          {isLoading ? "Adding..." : "Add to Cart"}
</Button>
  );
};

export default AddToCartButton;
