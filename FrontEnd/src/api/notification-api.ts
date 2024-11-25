import axios from 'axios';
import {api} from "@/utils/apiConfig";

export enum NotificationType {
  INFO ="INFO",
  WARNING ="WARNING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export interface NotificationResponse {
  id: string;
  title: string;
  message_1: string;
  message_2?: string;
  message_3?: string;
  link?: string;
  read: boolean;
  type: NotificationType;
  createdAt: string;
}

export const getAllNotifications = async (): Promise<NotificationResponse[]> => {
  try {
    const response = await api.get(`/notifications/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (): Promise<NotificationResponse[]> => {
  try {
    const response = await api.get(`/notifications/unread`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

export const markAsRead = async (id: string): Promise<NotificationResponse> => {
  try {
   const response = await api.put(`/notifications/${id}/read`);
   return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
