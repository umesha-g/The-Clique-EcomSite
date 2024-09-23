"use client";
import React from "react";
import Wishlist from "./wishlistComponents/Wishlist";

const WishlistPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Wishlist />
    </div>
  );
};

export default WishlistPage;
