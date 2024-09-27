"use client";

import { fetchCartItems } from "@/api/cart";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartItemCount: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const refreshCart = useCallback(async () => {
    try {
      const items = await fetchCartItems();
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, cartItemCount, totalPrice, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
