import {api} from "@/utils/apiConfig";
import {MiniDiscountResponse} from "@/api/discount-api";

export interface BrandRequest {
  name: string;
  description?: string;
  discountId?:string;
  logoFile: File | null;
  existingLogoUrl?: string;
}

export interface BrandResponse {
  id: string;
  name: string;
  description: string;
  discount?:MiniDiscountResponse;
  logoUrl: string;
  active: boolean;
}

export interface MiniBrandResponse {
  id: string;
  name: string;
}

export const createBrand = async (
  brandRequest: BrandRequest,
): Promise<BrandResponse> => {
  try {
    const formData = new FormData();
    Object.entries(brandRequest).forEach(([key, value]) => {
      if (!(key === 'logoFile' && (!value || (value instanceof File && value.size === 0)))) {
        formData.append(key, value);
      }
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
      if (!(key === 'logoFile' && (!value || (value instanceof File && value.size === 0)))) {
        formData.append(key, value);
      }
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

export const updateBrandState = async (
    id: string,
    state:boolean,
): Promise<BrandResponse> => {
  try {
    const response = await api.put(
        `/admin/brands/state/${id}/${state}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating discount:', error);
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
