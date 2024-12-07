"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowUpDown, Search } from 'lucide-react';
import CommonHeader from "@/app/components/CommonHeader";
import { OrderResponse, OrderStatus } from '@/api/admin/admin-order-api';
import { getUserOrders } from '@/api/order-api';
import OrderStatusBadge from "@/app/user/[userSlug]/order/[id]/orderComponents/OrderStatusBadge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Pagination} from "@/app/components/PaginationComponent";
import CommonFooter from "@/app/components/CommonFooter";

interface OrdersPageProps {
    params: {
        userSlug: string;
    };
}

export default function OrdersPage({ params }: OrdersPageProps) {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState('createdAt');
    const pageSize = 10;

    const fetchOrders = async (page: number) => {
        try {
            setLoading(true);
            const response = await getUserOrders(page, pageSize, sortBy);
            setOrders(response.content);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError('Failed to load orders. Please try again later.');
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage, sortBy]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setCurrentPage(0);
    };

    if (loading && orders.length === 0) {
        return (
            <div className="container mx-auto p-4">
                <CommonHeader
                    categoryVisibility="visible"
                    searchBarWidth="64"
                    isSearchAvailable={true}
                />
                <Card className="rounded-none mt-24">
                    <CardContent className="p-6">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 mt-4">
                <CommonHeader
                    categoryVisibility="visible"
                    searchBarWidth="64"
                    isSearchAvailable={true}
                />
                <Card className="rounded-none mt-24">
                    <CardContent className="p-6 text-center">
                        <h1 className="text-xl text-neutral-500">{error}</h1>
                        <Button
                            onClick={() => router.back()}
                            className="mt-4 rounded-none"
                        >
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <CommonHeader
                categoryVisibility="visible"
                searchBarWidth="64"
                isSearchAvailable={true}
            />
            <div className="container mx-auto p-4 min-h-screen">
                <Card className="rounded-none mt-20 md:mt-28">
                    <CardHeader className="px-6 py-4 border-b">
                        <nav className="flex text-sm text-gray-500 space-x-2 ">
                            <a href="/home" className="hover:text-gray-800">Home</a>
                            <span>/</span>
                            <span className="text-gray-800">Orders</span>
                        </nav>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className=" text-xl sm:text-2xl">My Orders</CardTitle>
                                <p className="text-sm text-gray-500 mt-1">
                                    View and manage your orders
                                </p>
                            </div>
                            <Select value={sortBy} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-[180px] rounded-none">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="createdAt">Date (Latest First)</SelectItem>
                                    <SelectItem value="totalAmount">Amount (Highest First)</SelectItem>
                                    <SelectItem value="status">Status</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-beige-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium">No Orders Found</h3>
                                <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
                                <Button
                                    onClick={() => router.push('/home')}
                                    className="mt-4 rounded-full"
                                >
                                    Start Shopping
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 mt-10">
                                {orders.map((order) => (
                                    <Card
                                        key={order.id}
                                        className="rounded-none hover:bg-neutral-100 transition-all cursor-pointer"
                                        onClick={() => router.push(`/user/${params.userSlug}/order/${order.id}`)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-4">
                                                        <Package className="w-8 h-8 sm:w-10 sm:h-10 text-beige-300" />
                                                        <div>
                                                            <h3 className="font-medium text-sm sm:text-lg text-balance w-48 md:w-64 lg:w-full">Order #{order.id}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 ml-12 sm:ml-14">
                                                        <p className="text-sm text-gray-600">
                                                            {order.orderItems.length} items • Total: ${order.totalAmount.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row items-start md:items-center ml-12 sm:ml-14 space-y-2 md:space-y-0 md:space-x-6">
                                                    <div className="text-right space-x-2 flex md:flex-col">
                                                        <p className="text-sm font-medium">Estimated Delivery</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className={"mt-6"}>
                                                        <OrderStatusBadge status={order.status} />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                        totalPages={totalPages}/>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <footer>
                <CommonFooter height={"h-14"}/>
            </footer>
        </div>
    );
}