import axios from 'axios';
import {api} from "@/utils/apiConfig";

enum AddressType {
  HOME,
  OFFICE,
  OTHER,
}

export interface AddressRequest {
  receiverName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressResponse {
  id: string;
  receiverName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  addressType: AddressType;
}

export const createAddress = async (
    request: AddressRequest
): Promise<AddressResponse> => {
  try {
    const response = await api.post('/addresses', request);
    return response.data;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};

export const getUserAddresses = async (): Promise<AddressResponse[]> => {
  try {
    const response = await api.get('/addresses');
    return response.data;
  } catch (error) {
    console.error('Error getting user addresses:', error);
    throw error;
  }
};

export const getAddress = async (addressId: string): Promise<AddressResponse> => {
  try {
    const response = await api.get(`/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting address:', error);
    throw error;
  }
};

export const updateAddress = async (
    addressId: string,
    request: AddressRequest
): Promise<AddressResponse> => {
  try {
    const response = await api.put(`/addresses/${addressId}`, request);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

export const deleteAddress = async (addressId: string): Promise<void> => {
  try {
    await api.delete(`/addresses/${addressId}`);
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};
