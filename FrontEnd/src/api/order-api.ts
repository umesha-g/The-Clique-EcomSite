import axios from 'axios';
import { OrderResponse } from './admin/admin-order-api';
import {api} from "@/utils/apiConfig";

export interface OrderRequest {
  addressId: string;
}

export const getUserOrders = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
): Promise<{
  content: OrderResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await api.get(`/orders`, {
      params: { page, size, sortBy },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getOrder = async (id: string): Promise<OrderResponse> => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const createOrder = async (
  orderRequest: OrderRequest,
): Promise<OrderResponse> => {
  try {
    const response = await api.post(`/orders`, orderRequest);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
