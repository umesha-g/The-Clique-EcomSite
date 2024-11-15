import {api} from "@/utils/apiConfig";

export interface UserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  phoneNumber?: string;
  userPDFile? : File | null;
  existingDPUrl?: string;
}

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
  UserDPUrl:string;
  createdAt: string;
}

export const createUser = async (
  request: UserRequest,
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

export const updateUserById = async (
  id: string,
  request: UserRequest,
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
  searchTerm:string ): Promise<{
  content: UserResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await api.get(`/admin/users`, {
      params: { page, size, sortBy , searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Users:', error);
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
