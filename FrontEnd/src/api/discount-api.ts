import {api} from "@/utils/apiConfig";
import {DiscountResponse} from "@/api/admin/admin-discount-api";

export interface MiniDiscountResponse {
    id: string;
    name: string;
    description: string;
}

export const getActiveDiscounts = async (): Promise<MiniDiscountResponse[]> => {
    try {
        const response = await api.get(`/discounts/active`);
        return response.data;
    } catch (error) {
        console.error('Error fetching active discounts:', error);
        throw error;
    }
};