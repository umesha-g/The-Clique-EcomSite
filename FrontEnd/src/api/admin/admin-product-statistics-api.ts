import { api } from "@/utils/apiConfig";

export interface ProductStatisticsResponse {
    id: string;
    productId: string;
    viewCount?: number;
    purchaseCount?: number;
    revenue?: number;
    date: Date;
    averageRating?: number;
    reviewCount?: number;
    //viewHistory?: Record<string, number>;
    //purchaseHistory?: Record<string, number>;
}

export const getProductStatistics = async (
    productId: string,
    startDate: string,
    endDate: string
): Promise<ProductStatisticsResponse[]> => {
    try {
        const response = await api.get(`/admin/product-statistics/${productId}`, {
            params: {
                startDate: startDate,
                endDate: endDate,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching product statistics:', error);
        throw error;
    }
};

export const getTopPerformingProducts = async (
    limit: number = 10,
    startDate: string,
    endDate: string
): Promise<ProductStatisticsResponse[]> => {
    try {
        const response = await api.get('/admin/product-statistics/top-performing', {
            params: {
                limit,
                startDate,
                endDate,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching top performing products:', error);
        throw error;
    }
};