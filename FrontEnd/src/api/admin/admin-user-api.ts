import axios from 'axios';
import {api} from "@/utils/apiConfig";
export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface UserProfileUpdateRequest {
  firstName: string;
  lastName?: string;
  email: string;
  currentPassword: string;
  newPassword?: string;
  phoneNumber?: string;
}

enum Role {
  USER,
  ADMIN,
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  createdAt: string;
}

export const createUser = async (
  request: RegisterRequest,
): Promise<UserResponse> => {
  try {
    const response = await api.post(`/admin/users`, request);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (id: string): Promise<UserResponse> => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  request: UserProfileUpdateRequest,
): Promise<UserResponse> => {
  try {
    const response = await api.put(`/admin/users/${id}`, request);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getAllUsers = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
): Promise<{
  content: UserResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await api.get(`/admin/users`, {
      params: { page, size, sortBy },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/admin/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
