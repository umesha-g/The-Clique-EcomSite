"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImageUrl: string;
}

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const response = await axios.get("/api/wishlist");
      setWishlistItems(response.data);
    } catch (error) {
      setError("Error fetching wishlist items.");
      console.error("Error fetching wishlist items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: number) => {
    try {
      await axios.delete(`/api/wishlist/${itemId}`);
      setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
    } catch (error) {
      setError("Error removing item from wishlist.");
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleMoveToCart = async (productId: number) => {
    try {
      await axios.post("/api/cart", { productId });
      await handleRemoveFromWishlist(productId);
      alert("Item moved to cart!");
    } catch (error) {
      setError("Error moving item to cart.");
      console.error("Error moving item to cart:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          {/*  <Spinner />Add spinner styling */}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex flex-col">
              <Image
                src={item.productImageUrl}
                alt={item.productName}
                width={500} // Adjust the width as needed
                height={300} // Adjust the height as needed
                className="object-cover mb-4 rounded"
              />
              <h2 className="text-xl font-semibold mb-2">{item.productName}</h2>
              <p className="text-lg mb-4">${item.productPrice.toFixed(2)}</p>
              <div className="mt-auto flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </Button>
                <Button onClick={() => handleMoveToCart(item.productId)}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Move to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
