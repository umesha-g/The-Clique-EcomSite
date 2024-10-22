import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const downloadFile = async (fileName: string): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_URL}/files/${fileName}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};
