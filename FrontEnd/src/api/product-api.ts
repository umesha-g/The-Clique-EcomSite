import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface ProductCardResponse {
  id: string;
  name: string;
  price: number;
  rating: number;
  cardImageUrl: string;
  purchaseCount: number;
  stock: number;
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

export const getAllProducts = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt"
): Promise<{
  content: ProductCardResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: { page, size, sortBy },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

export const getProduct = async (id: string): Promise<ProductCardResponse> => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const searchProducts = async (
  params: ProductSearchParams
): Promise<{
  content: ProductCardResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await axios.get(`${API_URL}/products/search`, { params });
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getAllProductsByCategory = async (
  categoryId: string,
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt"
): Promise<{
  content: ProductCardResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await axios.get(`${API_URL}/products/${categoryId}`, {
      params: { page, size, sortBy },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};
