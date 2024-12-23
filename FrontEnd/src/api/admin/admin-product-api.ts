import {api} from "@/utils/apiConfig";
import {MiniBrandResponse} from "@/api/admin/admin-brand-api";
import {MiniCategoryResponse} from "@/api/admin/admin-category-api";
import {MiniDiscountResponse} from "@/api/discount-api";

export interface ProductRequest {
  name: string;
  price: number;
  stock: number;
  description: string;
  brandId?: string;
  categoryId: string;
  discountId?: string;
  gender: Gender;
  sizes: string[];
  colors: string[];
}

export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount:number;
  description: string;
  brand?: MiniBrandResponse;
  category: MiniCategoryResponse;
  detailImageUrls: string[];
  cardImageUrl: string;
  gender: Gender;
  sizes: string[];
  colors: string[];
  purchaseCount: number;
  viewCount:number;
  createdAt: Date;
  updatedAt:Date;
  directDiscount?: MiniDiscountResponse;
  otherDiscount?: MiniDiscountResponse;
}

export enum ImageStatus {
  PENDING,
  ACTIVE,
  DELETED,
}

export enum Gender {
  MEN = "MEN",
  WOMEN = "WOMEN",
  UNISEX = "UNISEX",
}

export interface FileRefResponse {
  id:string;
  standardUrl: string;
  cardImage: boolean;
  displayOrder?: number;
  status: ImageStatus;
}

export const getAllProducts = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    searchTerm: string): Promise<{
  content: ProductResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await api.get(`/admin/products`, {
      params: { page, size, sortBy, searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (
  request: ProductRequest,
): Promise<ProductResponse> => {
  try {
    const response = await api.post(`/admin/products`, request);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  request: ProductRequest,
): Promise<ProductResponse> => {
  try {
    const response = await api.put(
      `/admin/products/${id}`,
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/admin/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const uploadProductImage = async (
  productId: string,
  file: File,
  isCardImage: boolean = false,
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isCardImage', isCardImage.toString());

    const response = await api.post(
      `/admin/products/${productId}/images`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
};

export const getProductImages = async (
  productId: string,
): Promise<FileRefResponse[]> => {
  try {
    const response = await api.get(
      `/admin/products/${productId}/images`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product images:', error);
    throw error;
  }
};

export const deleteProductImage = async (
  productId: string,
  fileId: string,
): Promise<string> => {
  try {
    const response = await api.delete(
      `/admin/products/${productId}/images/${fileId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting product image:', error);
    throw error;
  }
};

export const setAsCardImage = async (
  productId: string,
  fileId: string,
): Promise<string> => {
  try {
    const response = await api.put(
      `/admin/products/${productId}/images/${fileId}/setAsCard`,
    );
    return response.data;
  } catch (error) {
    console.error('Error setting image as card image:', error);
    throw error;
  }
};
