import axios from 'axios';
import { LoginRequest, RegisterRequest } from '../types/auth';

const BASE_URL = 'http://localhost:8080/api/v1/auth';

export const authApi = {
  login: async (request: LoginRequest): Promise<void> => {
    await axios.post(`${BASE_URL}/login`, request);
  },

  register: async (request: RegisterRequest): Promise<void> => {
    await axios.post(`${BASE_URL}/register`, request);
  },

  logout: async (): Promise<void> => {
    await axios.post(`${BASE_URL}/logout`);
  },
};