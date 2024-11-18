import {BrandResponse, MiniBrandResponse} from './admin/admin-brand-api';
import {api} from "@/utils/apiConfig";

export const getAllBrands = async (): Promise<BrandResponse[]> => {
  try {
    const response = await api.get('/brands');
    return response.data;
  } catch (error) {
    console.error('Error getting all brands:', error);
    throw error;
  }
};

export const getActiveBrands = async (): Promise<MiniBrandResponse[]> => {
  try {
    const response = await api.get('/brands/active');
    return response.data;
  } catch (error) {
    console.error('Error getting active brands:', error);
    throw error;
  }
};

export const getBrandById = async (id: string): Promise<BrandResponse> => {
  try {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting brand by id:', error);
    throw error;
  }
};