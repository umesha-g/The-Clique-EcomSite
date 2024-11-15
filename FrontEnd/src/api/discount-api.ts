import {api} from "@/utils/apiConfig";

export interface MiniDiscountResponse {
    id: string;
    name: string;
    discountPercentage:number;
    active:boolean;
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