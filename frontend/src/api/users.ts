import { API_URL } from "@/utils/config";
import axios, { AxiosError } from "axios";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface ApiResponse {
  isSuccess?: string;
  message?: string;
  error?: string;
  email?: string;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Fetch user profile
export const fetchUserProfile = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>("/users/profile");
    return response.data;
  } catch (error) {
    return null;
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<ApiResponse | null> => {
  try {
    const response = await api.post<ApiResponse>("/users/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  fullName: string
): Promise<ApiResponse | null> => {
  try {
    const response = await api.post<ApiResponse>("/users/register", {
      email,
      password,
      fullName,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (
  fullName: string
): Promise<string | null> => {
  try {
    const response = await api.put<ApiResponse>("/users/profile", { fullName });
    return response.data.message ?? "Profile updated successfully";
  } catch (error) {
    return "Update failed";
  }
};

// Logout user
export const logoutUser = async (): Promise<ApiResponse | null> => {
  try {
    const response = await api.post<ApiResponse>("/users/logout");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("An error occurred during logout:", axiosError.message);
    return null;
  }
};
