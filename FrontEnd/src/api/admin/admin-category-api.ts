import {api} from "@/utils/apiConfig";

export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
}

export const createCategory = async (
  categoryRequest: CategoryRequest,
): Promise<CategoryResponse> => {
  try {
    const response = await api.post(
      `/admin/categories`,
      categoryRequest,
    );
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  categoryRequest: CategoryRequest,
): Promise<CategoryResponse> => {
  try {
    const response = await api.put(
      `/admin/categories/${id}`,
      categoryRequest,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/admin/categories/${id}`);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
