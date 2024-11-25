"use client";
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from "@/api/wishlist-api";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/contexts/authContext";
import {useRouter} from "next/navigation";

interface WishlistHeartButtonProps {
    productId: string;
}

const ProductWishlistButton:React.FC<WishlistHeartButtonProps> = ({
                                                                    productId,
                                                                    }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const {user  } = useAuth();
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
            const callbackUrl = window.location.pathname;
            router.push(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`)
        }
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
            { isInWishlist ? (isLoading ? "Removing..." : " Remove From Wishlist") : (isLoading ? "Adding..." : "Add to Wishlist")}
        </Button>
        </div>
    );
};

export default ProductWishlistButton;
