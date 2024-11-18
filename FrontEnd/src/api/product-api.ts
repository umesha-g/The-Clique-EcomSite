import {Gender, ProductResponse} from './admin/admin-product-api';
import {api} from "@/utils/apiConfig";
import {MiniDiscountResponse} from "@/api/discount-api";

export interface ProductCardResponse {
  id: string;
  name: string;
  price: number;
  rating: number;
  cardImageUrl: string;
  purchaseCount: number;
  stock: number;
  directDiscount?: MiniDiscountResponse;
  otherDiscount?: MiniDiscountResponse;
}

export interface ProductSearchParams {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: Gender;
  searchTerm?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

export const getProductPriceRange = async (): Promise<PriceRange> => {
  try {
    const response = await api.get('/products/price-range');
    return response.data;
  } catch (error) {
    console.error('Error fetching price range:', error);
    throw error;
  }
};

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
    const response = await api.get(`/products/category/${categoryId}`, {
      params: { page, size, sortBy },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};
