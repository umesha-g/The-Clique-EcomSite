import {Gender, ProductResponse} from './admin/admin-product-api';
import {api} from "@/utils/apiConfig";
import {MiniDiscountResponse} from "@/api/discount-api";

export interface ProductSlugResponse {
  id: string;
  name: string;
}

export interface ProductCardResponse {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount:number;
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

export interface ProductDiscountRangeParams {
  minDirectDiscount?: number;
  maxDirectDiscount?: number;
  minOtherDiscount?: number;
  maxOtherDiscount?: number;
  page?: number;
  size?: number;
  sortBy?: string;
}

export async function getAllProductSlugs(): Promise<ProductSlugResponse[]> {
  try {
    const response = await api.get<ProductSlugResponse[]>('/products/slugs');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product slugs:', error);
    return [];
  }
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

export const getRelatedProduct = async (id?: string): Promise<ProductCardResponse[]> => {
  try {
    const response = await api.get(`products/${id}/related`);
    return response.data;
  } catch (error) {
    console.error('Error fetching related product:', error);
    throw error;
  }
};

export const viewCount = async (id: string)=> {
  try {
     await api.post(`/products/${id}/view`);
  } catch (error) {
    console.error('Error increasing view count:', error);
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

export const getBestSellingProducts = async (
    startDate?: string,
    endDate?: string,
): Promise< ProductCardResponse[]> => {
  try {
    const response = await api.get('/products/best-selling', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching best-selling products:', error);
    throw error;
  }
};

export const getTrendingProducts = async (
    startDate?: string,
    endDate?: string,
): Promise<ProductCardResponse[]> => {
  try {
    const response = await api.get('/products/trending', {
      params: { startDate, endDate}
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    throw error;
  }
};

export const getProductsByDiscountRange = async (
    params: ProductDiscountRangeParams
): Promise<{
  content: ProductCardResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await api.get(`/products/deals`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by discount range:', error);
    throw error;
  }
};

export const getProductNameSuggestions = async (
    searchTerm: string = ''
): Promise<string[]> => {
  try {
    const response = await api.get(`/products/suggestions`, {
      params: { q: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching product name suggestions:', error);
    return [];
  }
};