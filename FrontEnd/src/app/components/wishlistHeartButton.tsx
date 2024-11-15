"use client";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/api/wishlist-api";
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
        const wishlistItems = await getWishlist();
        setIsInWishlist(
          wishlistItems.products.some((item: { id: string }) => item.id === productId)
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
        success = await addToWishlist(productId);
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
      className="absolute top-4 right-4 z-10 dark:bg-gray-800 rounded-full  "
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
