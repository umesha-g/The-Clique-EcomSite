import { RegisterRequest } from './admin/admin-user-api';
import {api} from "@/utils/apiConfig";

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (request: LoginRequest): Promise<void> => {
  try {
    await api.post('/auth/login', request);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (request: RegisterRequest): Promise<void> => {
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
