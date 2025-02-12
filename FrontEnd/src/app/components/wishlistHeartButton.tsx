"use client";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/api/wishlist-api";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import {cn} from "@/lib/utils";
import {useAuth} from "@/contexts/authContext";
import {useRouter} from "next/navigation";

interface WishlistHeartButtonProps {
  productId: string;
}

const WishlistHeartButton = ({
                               productId,
                               className
                              }: WishlistHeartButtonProps & { className?: string }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {user } = useAuth();
  const router = useRouter();

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
    if(!user){
      router.push("/auth")}
    else {
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
    }
  };

  return (
    <motion.button
        className={cn(
            className
        )}
      onClick={toggleWishlist}
      initial={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={isLoading}
    >
      <motion.div
        initial={{ scale: 1 }} 
        animate={{ scale: isInWishlist ? [1, 2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          size={24}
          className={`${
            isInWishlist
              ? "fill-red-500 text-red-800"
              : "fill-neutral-300 text-neutral-700"
          } transition-colors duration-300`}
        />
      </motion.div>
    </motion.button>
  );
};

export default WishlistHeartButton;
