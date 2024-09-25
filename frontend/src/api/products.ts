import { API_URL } from "@/utils/config";
import axios from "axios";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  seller: User;
  imageUrl: string;
}

// const getAuthToken = (): string => {
//   return document.cookie.split("=")[1];
// };

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// api.interceptors.request.use((config) => {
//   const token = getAuthToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const fetchAllProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/products");
  return response.data;
};

export const fetchSellerProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/products/seller");
  return response.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product: Product): Promise<Product> => {
  const response = await api.post<Product>("/products", product);
  return response.data;
};

export const updateProduct = async (
  id: string,
  product: Product
): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await api.get<Product[]>(`/products/search?q=${query}`);
  return response.data;
};

export const getSearchSuggestions = async (
  query: string
): Promise<string[]> => {
  const response = await api.get<string[]>(
    `/products/searchSuggestions?q=${query}`
  );
  return response.data;
};
