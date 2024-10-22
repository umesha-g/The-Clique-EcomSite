import axios from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

enum NotificationType {
  INFO,
  WARNING,
  ERROR,
  SUCCESS,
}

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  type: NotificationType;
  createdAt: string;
}

export const getUnreadNotifications = async (): Promise<
  NotificationResponse[]
> => {
  try {
    const response = await axios.get(`${API_URL}/notifications/unread`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

export const markAsRead = async (id: string): Promise<void> => {
  try {
    await axios.put(`${API_URL}/notifications/${id}/read`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
