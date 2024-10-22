import axios from 'axios';
import { UserProfileUpdateRequest } from './admin/admin-user-api';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

enum Role {
  USER,
  ADMIN,
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
  createdAt: string;
}

export const getUser = async (): Promise<UserResponse> => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (
  request: UserProfileUpdateRequest,
): Promise<UserResponse> => {
  try {
    const response = await axios.put(`${API_URL}/users`, request);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/users`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
