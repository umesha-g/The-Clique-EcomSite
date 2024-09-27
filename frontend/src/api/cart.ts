import { API_URL } from "@/utils/config";
import axios from "axios";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  seller: User;
  imageUrl: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export const addToCart = async (productId: string) => {
  try {
    await api.post(`/cart/${productId}`);
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const fetchCartItems = async (): Promise<CartItem[]> => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const removeItem = async (itemId: string) => {
  try {
    await api.delete(`/cart/${itemId}`);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (
  itemId: string,
  quantityChange: number
) => {
  try {
    const response = await api.put(
      `/cart/${itemId}?quantityChange=${quantityChange}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};
