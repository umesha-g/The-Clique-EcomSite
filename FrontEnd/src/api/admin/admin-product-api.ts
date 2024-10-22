import { DiscountResponse } from './admin-discount-api';
import {api} from "@/utils/apiConfig";

export interface ProductRequest {
  name: string;
  price: number;
  stock: number;
  description: string;
  brandId?: string;
  categoryId: string;
  discountId?: string;
  gender: string;
  sizes: string[];
  colors: string[];
}

export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  brandName?: string;
  categoryName: string;
  detailImageUrls: string[];
  cardImageUrl: string;
  gender: string;
  sizes: string[];
  colors: string[];
  purchaseCount: number;
  createdAt: Date;
  activeDiscount?: DiscountResponse;
}

enum ImageStatus {
  PENDING,
  ACTIVE,
  DELETED,
}

export interface FileRefResponse {
  thumbnailUrl: string;
  standardUrl: string;
  isCardImage: boolean;
  displayOrder?: number;
  status: ImageStatus;
}

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
      `/admin/products/${productId}/images/${fileId}/set-as-card`,
    );
    return response.data;
  } catch (error) {
    console.error('Error setting image as card image:', error);
    throw error;
  }
};
