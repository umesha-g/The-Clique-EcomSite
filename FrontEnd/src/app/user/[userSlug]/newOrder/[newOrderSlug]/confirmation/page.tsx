"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, MapPin, Clock } from 'lucide-react';
import { getOrder } from '@/api/order-api';
import CommonHeader from "@/app/components/Header";
import { OrderResponse } from '@/api/admin/admin-order-api';
import OrderStatusBadge from "@/app/user/[userSlug]/order/[id]/orderComponents/OrderStatusBadge";
import {useCart} from "@/contexts/cartContext";

interface OrderConfirmationPageProps {
    params: {
        userSlug: string;
        newOrderSlug: string;
    };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
    const router = useRouter();
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const{refreshCart} = useCart();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderData = await getOrder(params.newOrderSlug);
                setOrder(orderData);
                await refreshCart();
            } catch (err) {
                setError('Failed to load order details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [params.newOrderSlug]);

    if (loading) {
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

    if (error || !order) {
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
                        <nav className="flex text-sm text-gray-500 space-x-2">
                            <a href="/home" className="hover:text-gray-800">Home</a>
                            <span>/</span>
                            <p className="hover:text-gray-800">New Order</p>
                            <span>/</span>
                            <span className="text-gray-800">Confirmation</span>
                        </nav>
                    </CardHeader>

                    <CardContent className="p-4 md:p-8">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Order Successfully Placed!</h2>
                            <p className="text-gray-600">
                                Thank you for your order. We'll send you updates about your order status.
                            </p>
                        </div>

                        <Card className="rounded-none mb-6">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0 md:items-center items-start">
                                    <CardTitle className={"text-sm sm:text-base md:text-lg lg:text-xl text-balance sm:max-w-2xl font-semibold"}>Order #{order.id}</CardTitle>
                                    <OrderStatusBadge status={order.status} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-start space-x-3">
                                        <Package className="w-5 h-5 text-gray-500 mt-1" />
                                        <div>
                                            <h3 className="font-medium">Order Details</h3>
                                            <p className="text-sm text-gray-600">
                                                {order.orderItems.length} items
                                                <br />
                                                Total: ${order.totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                                        <div>
                                            <h3 className="font-medium">Delivery Address</h3>
                                            <p className="text-sm text-gray-600">
                                                {order.shippingAddress.addressLine}
                                                <br />
                                                {order.shippingAddress.city}, {order.shippingAddress.province}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Clock className="w-5 h-5 text-gray-500 mt-1" />
                                        <div>
                                            <h3 className="font-medium">Estimated Delivery</h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-x-4 ">
                            <Button
                                onClick={() => router.push(`/user/${params.userSlug}/order/${order.id}`)}
                                className="rounded-none"
                            >
                                View Order Details
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/home')}
                                className="rounded-none"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}