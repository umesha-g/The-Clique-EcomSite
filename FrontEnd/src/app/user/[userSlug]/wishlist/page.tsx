"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getWishlist, removeFromWishlist } from "@/api/wishlist-api";
import CommonHeader from "@/app/components/CommonHeader";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {Heart, ShoppingBag} from "lucide-react";
import {ProductCardResponse} from "@/api/product-api";
import WishlistItem from "@/app/user/[userSlug]/wishlist/wishlistComponents/WishlistItem";
import CommonFooter from "@/app/components/CommonFooter";

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<ProductCardResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const[error,setError] = useState<string | null>(null);

    const fetchWishlist = async () => {
        try {
            const wishlist = await getWishlist();
            setWishlistItems(wishlist.products);
            setLoading(false);
        } catch (error) {
            setError('Failed to load wishlist. Please try again later.')
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId: string) => {
        try {
            await removeFromWishlist(productId);
            setWishlistItems(
                wishlistItems.filter((item) => item.id !== productId)
            );
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <CommonHeader
                        categoryVisibility={"visible"}
                          searchBarWidth={"64"}
                          isSearchAvailable={true}
                />
                <Card className="rounded-none mt-24">
                    <CardContent className="p-6">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 mt-4">
                <CommonHeader
                    categoryVisibility="visible"
                    searchBarWidth="64"
                    isSearchAvailable={true}
                />
                <Card className="rounded-none mt-24">
                    <CardContent className="p-6 text-center">
                        <h1 className="text-xl text-neutral-500">{error}</h1>
                        <Button
                            onClick={() => router.back()}
                            className="mt-4 rounded-none"
                        >
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <CommonHeader categoryVisibility={"visible"} searchBarWidth={"64"} isSearchAvailable={true} />
            <div className="container mx-auto p-4 min-h-screen">
                <Card className="rounded-none mt-20 md:mt-28">
                    <CardHeader className="px-6 py-4 border-b">
                        <nav className="flex text-sm text-gray-500 space-x-2">
                            <a href="/home" className="hover:text-gray-800">Home</a>
                            <span>/</span>
                            <span className="text-black">Wishlist</span>
                        </nav>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className={"mb-8"}>
                            <CardTitle className="text-xl sm:text-2xl">My Wishlist</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                View and manage your wishlist
                            </p>
                        </div>
                        {wishlistItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center space-y-4 py-16">
                                <Heart className="h-16 w-16 text-beige-300 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Your Wishlist is Empty
                                </h2>
                                <p className="text-gray-500 text-center mt-2">
                                    Explore our products and add items you love to your wishlist.
                                </p>
                                <Button
                                    onClick={() => router.push("/home")}
                                    className="mt-4 rounded-full"
                                >
                                    <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 mt-8">
                                {wishlistItems.map((item) => (
                                    <WishlistItem key={item.id} item={item} onRemove={handleRemoveFromWishlist}/>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <footer>
                <CommonFooter height={"h-14"}/>
            </footer>
        </div>
    );
}