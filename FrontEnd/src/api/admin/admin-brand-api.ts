import axios from 'axios';
import {api} from "@/utils/apiConfig";

export interface BrandRequest {
  name: string;
  description?: string;
  logoFile: File | null;
  isActive: boolean;
}

export interface BrandResponse {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  isActive: boolean;
}

export const createBrand = async (
  brandRequest: BrandRequest,
): Promise<BrandResponse> => {
  try {
    const formData = new FormData();
    Object.entries(brandRequest).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await api.post(`/admin/brands`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
};

export const updateBrand = async (
  id: string,
  brandRequest: BrandRequest,
): Promise<BrandResponse> => {
  try {
    const formData = new FormData();
    Object.entries(brandRequest).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await api.put(
      `/admin/brands/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
};

export const deleteBrand = async (id: string): Promise<void> => {
  try {
    await api.delete(`/admin/brands/${id}`);
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};
