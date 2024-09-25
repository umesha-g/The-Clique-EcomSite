import { API_URL } from "@/utils/config";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const fetchWishlist = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/wishlist");
  return response.data;
};

export const removeFromWishlist = async (productId: string) => {
  try {
    await api.delete(`/wishlist/${productId}`);
    return true;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return false;
  }
};

// Add product to wishlist
export const addProductToWishlist = async (productId: string) => {
  try {
    await api.post(`/wishlist/${productId}`);
    return true;
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return false;
  }
};

// Fetch specific wishlist item by ID
/*export const getWishlistItem = async (itemId: string): Promise<Product> => {
  try {
    const response = await api.get(`/wishlist/item/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist item:", error);
    return null;
  }
};*/
