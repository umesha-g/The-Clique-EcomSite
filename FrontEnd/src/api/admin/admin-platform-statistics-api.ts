import { api } from "@/utils/apiConfig";

export interface PlatformStatisticsResponse {
    id?: string;
    totalUsers?: number;
    totalOrders?: number;
    totalRevenue?: number;
    totalProducts?:number;
    date: Date;
    pendingDisputes?:number;
    newRegistrations?:number;
}

export const getPlatformStatistics = async (
    startDate: Date,
    endDate: Date
): Promise<PlatformStatisticsResponse[]> => {
    try {
        const response = await api.get('/admin/platform-statistics', {
            params: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching platform statistics:', error);
        throw error;
    }
};
