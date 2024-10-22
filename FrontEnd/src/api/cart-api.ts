import { ProductCardResponse } from './product-api';
import {api} from "@/utils/apiConfig";

export interface CartItem {
  product: ProductCardResponse;
  quantity: number;
}

export interface CartRequest {
  productId: string;
  quantity: number;
}

export interface CartResponse {
  id: string;
  cartItems: CartItem[];
  totalAmount: number;
  createdAt: string;
}

export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error getting cart:', error);
    throw error;
  }
};

export const addToCart = async (request: CartRequest): Promise<CartResponse> => {
  try {
    const response = await api.post('/cart/items', request);
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateQuantity = async (
    productId: string,
    request: CartRequest
): Promise<CartResponse> => {
  try {
    const response = await api.put(`/cart/items/${productId}`, request);
    return response.data;
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw error;
  }
};

export const incrementQuantity = async (productId: string): Promise<CartResponse> => {
  try {
    const response = await api.post(`/cart/items/${productId}/increment`);
    return response.data;
  } catch (error) {
    console.error('Error incrementing quantity:', error);
    throw error;
  }
};

export const decrementQuantity = async (productId: string): Promise<CartResponse> => {
  try {
    const response = await api.post(`/cart/items/${productId}/decrement`);
    return response.data;
  } catch (error) {
    console.error('Error decrementing quantity:', error);
    throw error;
  }
};

export const removeFromCart = async (productId: string): Promise<CartResponse> => {
  try {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async (): Promise<void> => {
  try {
    await api.delete('/cart');
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
