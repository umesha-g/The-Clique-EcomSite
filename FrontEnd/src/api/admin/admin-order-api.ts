import { AddressResponse } from '../address-api';
import { ProductCardResponse } from '../product-api';
import {api} from "@/utils/apiConfig";

enum OrderStatus {
  PENDING,
  CONFIRMED,
  SHIPPED,
  DELIVERED,
  CANCELLED,
  RETURNED,
  REFUNDED,
  FAILED,
}

interface OrderItem {
  product: ProductCardResponse;
  quantity: number;
}

export interface OrderResponse {
  id: string;
  orderItems: OrderItem[];
  shippingAddress: AddressResponse;
  totalAmount: number;
  shippingCost: number;
  status: OrderStatus;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusRequest {
  status: string;
}

export const getAllOrders = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
): Promise<{
  content: OrderResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await api.get(`/admin/orders`, {
      params: { page, size, sortBy },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (
  id: string,
  request: OrderStatusRequest,
): Promise<OrderResponse> => {
  try {
    const response = await api.patch(
      `/admin/orders/${id}/status`,
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
