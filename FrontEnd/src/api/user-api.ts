import {api} from "@/utils/apiConfig";
import {UserRequest, UserResponse} from "@/api/admin/admin-user-api";

export const getUser = async (): Promise<UserResponse> => {
  try {
    const response = await api.get(`/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (
  request: UserRequest,
): Promise<UserResponse> => {
  try {
    const response = await api.put(`/users`, request);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (): Promise<void> => {
  try {
    await api.delete(`/users`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
