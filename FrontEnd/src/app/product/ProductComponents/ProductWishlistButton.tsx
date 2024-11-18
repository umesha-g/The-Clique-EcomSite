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
import {Button} from "@/components/ui/button";

interface WishlistHeartButtonProps {
    productId: string;
}

const ProductWishlistButton:React.FC<WishlistHeartButtonProps> = ({
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
        <div >
        <Button
            onClick={toggleWishlist}
            disabled={isLoading}
            variant={"outline"}
            className={"flex w-full rounded-none border-2 border-black space-x-3 h-12 text-lg" }
        >
            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isInWishlist ? [1, 2, 1] : 1 }}
                transition={{ duration: 0.3 }}
            >
                <Heart
                    size={"30"}
                    className={`${
                        isInWishlist
                            ? "fill-red-500 text-red-500"
                            : "fill-none text-black"
                    } transition-colors duration-300 `}
                />
            </motion.div>
            {isLoading ? "Adding..." : isInWishlist? "Remove From Wishlist" : "Add to Wishlist"}
        </Button>
        </div>
    );
};

export default ProductWishlistButton;
