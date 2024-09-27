"use client";

import { addToCart } from "@/api/cart";
import { useCart } from "@/contexts/cartContext";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCart } = useCart();

  const addItemToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(productId);
      refreshCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      className="bg-blue-950 hover:bg-blue-800 text-white justify-center font-medium py-1 px-4 rounded-lg flex items-center w-full self-center"
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
