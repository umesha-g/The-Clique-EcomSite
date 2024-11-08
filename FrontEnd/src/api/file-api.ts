
import {api} from "@/utils/apiConfig";

export const downloadFile = async (fileName: string): Promise<Blob> => {
  try {
    const response = await api.get(`/files/${fileName}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};
