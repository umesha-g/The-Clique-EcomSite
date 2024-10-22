import axios from 'axios';
import { DiscountResponse } from './admin/admin-discount-api';
import { ProductResponse } from './admin/admin-product-api';
import {api} from "@/utils/apiConfig";

export interface ProductCardResponse {
  id: string;
  name: string;
  price: number;
  rating: number;
  cardImageUrl: string;
  purchaseCount: number;
  stock: number;
  activeDiscount?: DiscountResponse;
}

export interface ProductSearchParams {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  searchTerm?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const getProduct = async (id: string): Promise<ProductResponse> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const searchProducts = async (
  params: ProductSearchParams,
): Promise<{
  content: ProductCardResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await api.get(`/products/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const getAllProductsByCategory = async (
  categoryId: string,
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
): Promise<{
  content: ProductCardResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await api.get(`/products/${categoryId}`, {
      params: { page, size, sortBy },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};