"use client";

import {addToCart, CartRequest} from "@/api/cart-api";
import { useCart } from "@/contexts/cartContext";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
  selectedColour:string;
  selectedSize:string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId,quantity,selectedColour,selectedSize }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCart } = useCart();

  const addItemToCart = async () => {
    setIsLoading(true);
    try {
      const request:CartRequest = {productId,quantity,selectedColour,selectedSize}
      await addToCart(request);
      await refreshCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      className="z-50 bg-black text-sm hover:bg-gray-800 text-white justify-center font-medium py-1 px-4 rounded-none flex items-center w-full self-center"
      onClick={addItemToCart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
    >
      <ShoppingCart className="mr-4" size={20} />
      {isLoading ? "Adding..." : "Add to Cart"}
    </motion.button>
  );
};

export default AddToCartButton;
