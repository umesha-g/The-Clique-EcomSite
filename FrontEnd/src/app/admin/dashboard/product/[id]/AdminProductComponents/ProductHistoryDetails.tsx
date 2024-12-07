import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const transformHistoricalData = (history: Record<string, number>) => {
    return Object.entries(history).map(([date, value]) => ({
        date,
        value
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

interface ProductHistoryChartProps {
    viewHistory?: Record<string, number>
    purchaseHistory?: Record<string, number>
}

const ProductHistoryChart: React.FC<ProductHistoryChartProps> = ({
                                                                     viewHistory,
                                                                     purchaseHistory
                                                                 }) => {
    const viewData = viewHistory ? transformHistoricalData(viewHistory) : []
    const purchaseData = purchaseHistory ? transformHistoricalData(purchaseHistory) : []

    return (
        <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>View History</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={viewData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={purchaseData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductHistoryChart;