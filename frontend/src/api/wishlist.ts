import { API_URL } from "@/utils/config";
import axios from "axios";
import { fetchUserProfile } from "./users";

export const fetchWishlist = async () => {
  try {
    const response = await axios.get(`${API_URL}/wishlist/${getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};

export const removeFromWishlist = async (productId: string) => {
  try {
    await axios.delete(`${API_URL}/wishlist/${getUserId()}/${productId}`);
    return true;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return false;
  }
};

const getUserId = async () => {
  try {
    const userProfile = await fetchUserProfile();
    if (userProfile) {
      const userId = userProfile.id;
      return userId;
    }
  } catch (error) {
    console.error("No user profile found.");
    return null;
  }
};
