import {api} from "@/utils/apiConfig";

export interface DiscountRequest {
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

export interface DiscountResponse {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export const createDiscount = async (
  request: DiscountRequest,
): Promise<DiscountResponse> => {
  try {
    const response = await api.post(`admin/discounts`, request);
    return response.data;
  } catch (error) {
    console.error('Error creating discount:', error);
    throw error;
  }
};

export const getDiscount = async (id: string): Promise<DiscountResponse> => {
  try {
    const response = await api.get(`/admin/discounts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discount:', error);
    throw error;
  }
};

export const getAllDiscounts = async (): Promise<DiscountResponse[]> => {
  try {
    const response = await api.get(`/admin/discounts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all discounts:', error);
    throw error;
  }
};

export const updateDiscount = async (
  id: string,
  request: DiscountRequest,
): Promise<DiscountResponse> => {
  try {
    const response = await api.put(
      `/admin/discounts/${id}`,
      request,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating discount:', error);
    throw error;
  }
};

export const updateDiscountState = async (
    id: string,
    state:boolean,
): Promise<DiscountResponse> => {
  try {
    const response = await api.put(
        `/admin/discounts/state/${id}/${state}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating discount:', error);
    throw error;
  }
};

export const deleteDiscount = async (id: string): Promise<void> => {
  try {
    await api.delete(`/admin/discounts/${id}`);
  } catch (error) {
    console.error('Error deleting discount:', error);
    throw error;
  }
};
