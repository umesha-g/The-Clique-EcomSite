import axios from 'axios';
import { FileRefResponse } from './admin/admin-product-api';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface ReviewRequest {
  productId: string;
  rating: number;
  comment?: string;
  imageUrls?: string[];
}

export interface ReviewResponse {
  userFirstName: string;
  rating: number;
  comment?: string;
  imageUrls?: string[];
  createdAt: string;
}

export const createReview = async (
  reviewRequest: ReviewRequest,
): Promise<ReviewResponse> => {
  try {
    const response = await axios.post(`${API_URL}/reviews`, reviewRequest);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getProductReviews = async (
  productId: string,
  page: number = 0,
  size: number = 10,
): Promise<{
  content: ReviewResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await axios.get(
      `${API_URL}/reviews/product/${productId}`,
      {
        params: { page, size },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
};

export const getUserReviews = async (
  page: number = 0,
  size: number = 10,
): Promise<{
  content: ReviewResponse[];
  totalPages: number;
  totalElements: number;
}> => {
  try {
    const response = await axios.get(`${API_URL}/reviews/user/`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

export const uploadReviewImages = async (
  reviewId: string,
  files: File[],
): Promise<string> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axios.post(
      `${API_URL}/reviews/reviews/${reviewId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading review images:', error);
    throw error;
  }
};

export const getReviewImages = async (
  reviewId: string,
): Promise<FileRefResponse[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/reviews/reviews/${reviewId}/images`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching review images:', error);
    throw error;
  }
};
