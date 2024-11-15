import { AddressResponse } from '../address-api';
import { ProductCardResponse } from '../product-api';
import {api} from "@/utils/apiConfig";

export enum OrderStatus {
  ALL = "ALL",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED"
}

interface OrderItemResponse {
  id:string;
  product: ProductCardResponse;
  quantity: number;
  selectedColour:string;
  selectedSize:string;
  subTotal:number;
}

export interface OrderResponse {
  id: string;
  orderItems: OrderItemResponse[];
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
  searchTerm:string,
  status:OrderStatus
): Promise<{
  content: OrderResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    if(status === OrderStatus.ALL){
      const response = await api.get(`/admin/orders/search`, {
        params: { page, size, sortBy, searchTerm},

      });return response.data;
    }
    else{
      const response = await api.get(`/admin/orders/filtered`, {
      params: { page, size, sortBy, searchTerm ,status},

    }); return response.data;
    }

  } catch (error) {
    console.error('Error fetching orders:', error);
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
