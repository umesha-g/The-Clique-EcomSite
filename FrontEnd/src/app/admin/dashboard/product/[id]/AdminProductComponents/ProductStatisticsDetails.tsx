"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Bar,
    BarChart
} from "recharts";
import {
    DollarSign,
    Eye,
    ShoppingCart,
} from "lucide-react";

import { getProductStatistics,ProductStatisticsResponse } from '@/api/admin/admin-product-statistics-api';
import {Input} from "@/components/ui/input";

const ProductStatisticsDetails: React.FC<{ productId: string }> = ({ productId }) => {
    const [statistics, setStatistics] = useState<ProductStatisticsResponse[]>([])
    const [startDate, setStartDate] = useState('2024-11-01');
    const [endDate, setEndDate] = useState('2024-12-31');

    useEffect(() => {
        const fetchStatistics = async () => {
            if (startDate && endDate) {
                try {
                    const stats = await getProductStatistics(
                        productId,
                        startDate,
                        endDate
                    )
                    setStatistics(stats as ProductStatisticsResponse[])
                } catch (error) {
                    console.error('Failed to fetch product statistics', error)
                }
            }
        }

        fetchStatistics()
    }, [productId, startDate,endDate])

    // Prepare chart data
    const viewData = statistics.map(stat => ({
        date: new Date(stat.date).toLocaleDateString(),
        views: stat.viewCount || 0
    }))

    const purchaseData = statistics.map(stat => ({
        date: new Date(stat.date).toLocaleDateString(),
        purchases: stat.purchaseCount || 0
    }))

    const revenueData = statistics.map(stat => ({
        date: new Date(stat.date).toLocaleDateString(),
        revenue: stat.revenue || 0
    }))

    // Calculate totals
    const totalViews = statistics.reduce((sum, stat) => sum + (stat.viewCount || 0), 0)
    const totalPurchases = statistics.reduce((sum, stat) => sum + (stat.purchaseCount || 0), 0)
    const totalRevenue = statistics.reduce((sum, stat) => sum + (stat.revenue || 0), 0)

    const chartConfig = {
        views: {
            label: "Views",
            icon: Eye,
            color: "hsl(var(--chart-1))"
        },
        purchases: {
            label: "Purchases",
            icon: ShoppingCart,
            color: "hsl(var(--chart-2))"
        },
        revenue: {
            label: "Revenue",
            icon: DollarSign,
            color: "hsl(var(--chart-3))"
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Product Statistics</h2>
                <div className="flex space-x-4 mb-4">
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded-none"
                    />
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="rounded-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card className={"rounded-none"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 rounded-none">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className={"rounded-none"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 rounded-none">
                        <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPurchases.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className={"rounded-none"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 rounded-none">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="col-span-1 rounded-none">
                    <CardHeader>
                        <CardTitle className={"text-lg"}>Views Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={viewData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Line
                                        dataKey="views"
                                        stroke="#000000"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1 rounded-none">
                    <CardHeader>
                        <CardTitle className={"text-lg"}>Purchases Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={purchaseData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Bar
                                        dataKey="purchases"
                                        fill="#000000"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className={"rounded-none"}>
                <CardHeader>
                    <CardTitle className={"text-lg"}>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer className={"h-96 w-full"} config={chartConfig}>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={revenueData} >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<ChartTooltipContent />} />
                                <Line
                                    dataKey="revenue"
                                    stroke="#000000"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductStatisticsDetails;