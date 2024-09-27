"use client";

import {
  addProductToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "@/api/wishlist";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";

interface WishlistHeartButtonProps {
  productId: string;
}

const WishlistHeartButton: React.FC<WishlistHeartButtonProps> = ({
  productId,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      setIsLoading(true);
      try {
        const wishlistItems = await fetchWishlist();
        setIsInWishlist(
          wishlistItems.some((item: { id: string }) => item.id === productId)
        );
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWishlistStatus();
  }, [productId]);

  const toggleWishlist = async () => {
    setIsLoading(true);
    try {
      let success;
      if (isInWishlist) {
        success = await removeFromWishlist(productId);
      } else {
        success = await addProductToWishlist(productId);
      }
      if (success) {
        setIsInWishlist(!isInWishlist);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md"
      onClick={toggleWishlist}
      initial={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={isLoading}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isInWishlist ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={24}
          className={`${
            isInWishlist
              ? "fill-red-500 text-red-500"
              : "fill-none text-gray-400"
          } transition-colors duration-300`}
        />
      </motion.div>
    </motion.button>
  );
};

export default WishlistHeartButton;
