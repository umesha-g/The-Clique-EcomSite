import { UserRequest } from './admin/admin-user-api';
import {api} from "@/utils/apiConfig";

export const login = async (request: UserRequest): Promise<void> => {
  try {
    const response= await api.post('/auth/login', request);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (request: UserRequest): Promise<void> => {
  try {
    await api.post('/auth/register', request);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
