"use client";
import React, { useState, useEffect } from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrder } from '@/api/order-api';
import CommonHeader from "@/app/components/Header";
import OrderHeader from "./orderComponents/OrderHeader";
import OrderStatusBadge from "./orderComponents/OrderStatusBadge";
import OrderGeneralInfo from "./orderComponents/OrderGeneralInfo";
import { OrderResponse, OrderStatus } from '@/api/admin/admin-order-api';
import { useRouter } from 'next/navigation';

interface OrderDetailsPageProps {
    params: {
        userSlug: string;
        id: string;
    };
}

export interface OrderStatusProps {
    status: OrderStatus;
}

export interface StatusConfig {
    color: string;
    icon?: React.ReactNode;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const router = useRouter();
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userSlug = params.userSlug;
    const fetchOrderDetails = async () => {
        try {
            const orderData = await getOrder(params.id);
            setOrder(orderData);
        } catch (err) {
            setError('Failed to load order details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [params.id]);

    const LoadingState = () => (
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

    const ErrorState = () => (
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

    if (loading) return <LoadingState />;
    if (error || !order) return <ErrorState />;

    return (
        <div >
            <CommonHeader
                categoryVisibility="visible"
                searchBarWidth="64"
                isSearchAvailable={true}
            />
            <div className="container mx-auto p-4 mt-0">
                <Card className="rounded-none overflow-hidden mt-20 md:mt-28">
                    <CardHeader className="px-6 py-4 border">
                            <nav className="flex text-sm text-gray-500 space-x-2 ">
                                <a href="/home" className="hover:text-gray-800">Home</a>
                                <span>/</span>
                                <a href={`/user/${userSlug}/orders`} className="hover:text-gray-800">Orders</a>
                                <span>/</span>
                                <span className="text-gray-800">Order Details</span>
                            </nav>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                            <div>
                                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl text-balance sm:max-w-2xl font-semibold">Order #{order.id}</h2>
                                <p className="text-sm text-gray-500">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <OrderGeneralInfo order={order} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}