"use client";

import {CartItemResponse, getCart} from "@/api/cart-api";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {ProductCardResponse} from "@/api/product-api";

interface CartContextType {
  cartItems: CartItemResponse[];
  cartItemCount: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
  setRefetchCallback: (callback: (() => Promise<void>) | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                        children,
                                                                      }) => {
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [refetchCallback, setRefetchCallback] = useState<(() => Promise<void>) | null>(null);

  const calDiscountedPrice = (product:ProductCardResponse) => {
    const activeDiscount = product.directDiscount
        ? product.directDiscount
        : product.otherDiscount;

    return activeDiscount
        ? product.price * (1 - activeDiscount.discountPercentage / 100)
        : product.price;
  }

  const refreshCart = useCallback(async () => {
    try {
      const cart = await getCart();
      setCartItems(cart.cartItems);

      if (refetchCallback) {
        await refetchCallback();
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    }
  }, [refetchCallback]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
      (sum, item) => sum + (calDiscountedPrice(item.product)) * item.quantity,
      0
  );

  return (
      <CartContext.Provider
          value={{
            cartItems,
            cartItemCount,
            totalPrice,
            refreshCart,
            setRefetchCallback
          }}
      >
        {children}
      </CartContext.Provider>
  );
};