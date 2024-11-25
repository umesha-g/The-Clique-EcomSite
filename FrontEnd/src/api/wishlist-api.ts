import { ProductCardResponse } from './product-api';
import {api} from "@/utils/apiConfig";

export interface WishlistResponse {
  id: string;
  products: ProductCardResponse[];
  createdAt: string;
}

export const getWishlist = async (): Promise<WishlistResponse> => {
  try {
    const response = await api.get(`/wishlist`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const addToWishlist = async (
  productId: string,
): Promise<WishlistResponse> => {
  try {
    const response = await api.post(`/wishlist/items/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (
  productId: string,
): Promise<WishlistResponse> => {
  try {
    const response = await api.delete(
      `/wishlist/items/${productId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};
