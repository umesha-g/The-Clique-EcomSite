import { api } from "@/utils/apiConfig";

export interface ProductStatistics {
    id: string;
    productId: string;
    viewCount?: number;
    purchaseCount?: number;
    revenue?: number;
    date: Date;
}

export const getProductStatistics = async (
    productId: string,
    startDate: Date,
    endDate: Date
): Promise<ProductStatistics[]> => {
    try {
        const response = await api.get(`/api/v1/admin/product-statistics/${productId}`, {
            params: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching product statistics:', error);
        throw error;
    }
};