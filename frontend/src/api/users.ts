import { API_URL } from "@/utils/config";
import axios from "axios";

interface User {
  id: number;
  email: string;
  fullName: string;
  isNewUser: boolean;
}

export const fetchUserProfile = async (): Promise<User | null> => {
  try {
    const response = await axios.get<User>(`${API_URL}/api/users/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
