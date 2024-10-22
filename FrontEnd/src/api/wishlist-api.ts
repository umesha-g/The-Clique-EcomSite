import axios from 'axios';
import { ProductCardResponse } from './product-api';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface WishlistResponse {
  id: string;
  products: ProductCardResponse[];
  createdAt: string;
}

export const getWishlist = async (): Promise<WishlistResponse> => {
  try {
    const response = await axios.get(`${API_URL}/wishlist`);
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
    const response = await axios.post(`${API_URL}/wishlist/items/${productId}`);
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
    const response = await axios.delete(
      `${API_URL}/wishlist/items/${productId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};
