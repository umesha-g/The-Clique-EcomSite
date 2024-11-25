import { api } from "@/utils/apiConfig";

export interface PlatformStatistics {
    id: string;
    totalUsers?: number;
    totalOrders?: number;
    totalRevenue?: number;
    date: Date;
}

export const getPlatformStatistics = async (
    startDate: Date,
    endDate: Date
): Promise<PlatformStatistics[]> => {
    try {
        const response = await api.get('/api/v1/admin/platform-statistics', {
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
