import {CategoryResponse, MiniCategoryResponse} from './admin/admin-category-api';
import {api} from "@/utils/apiConfig";

export const getAllCategories = async (): Promise<MiniCategoryResponse[]> => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error getting all categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<CategoryResponse> => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting category by id:', error);
    throw error;
  }
};
