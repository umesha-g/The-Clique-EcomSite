"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import { validate } from 'uuid';
import { useCart } from "@/contexts/cartContext";
import { getUserAddresses, AddressResponse } from "@/api/address-api";
import { checkOrderId, createOrder, PaymentMethod } from "@/api/order-api";
import { decrementQuantity, incrementQuantity, removeFromCart } from "@/api/cart-api";
import { calculateDiscountedPrice } from "@/utils/DIscountCalculator";

import CommonHeader from "@/app/components/Header";
import { OrderSummary } from './newOrderComponents/orderSummary';
import { ShippingAddress } from './newOrderComponents/shippingAddress';
import { PaymentMethod as PaymentMethodComponent } from './newOrderComponents/paymentMethod';

interface OrderPlacementPageProps {
    params: {
        newOrderSlug: string;
        userSlug: string;
    };
}

export default function OrderPlacementPage({ params }: OrderPlacementPageProps) {
    const router = useRouter();
    const { cartItems, refreshCart, cartItemCount } = useCart();
    const [addresses, setAddresses] = useState<AddressResponse[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
    const shippingCost = 300;
    const [newOrderSlug] = useState<string>(params.newOrderSlug);
    const [userSlug] = useState<string>(params.userSlug);

    const subtotal = cartItems.reduce((total, item) =>
        total + (calculateDiscountedPrice(item.product) * item.quantity), 0);

    const totalAmount = subtotal + shippingCost;

    const fetchAddresses = async () => {
        try {
            const addressData = await getUserAddresses();
            setAddresses(addressData);

            const defaultAddress = addressData.find(addr => addr.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress.id);
            }

            setIsLoading(false);
        } catch (err) {
            setError('Failed to load addresses' + err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const validateOrderId = async () => {
            if (!validate(newOrderSlug)) {
                const exists = await isIdExists(newOrderSlug);
                if (!exists) {
                    router.push('/home');
                }
            }
        };
        validateOrderId();
    }, [newOrderSlug, router]);

    const isIdExists = async (id: string) => {
        try {
            return await checkOrderId(id);
        } catch (err) {
            setError('Id already exists' + err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (cartItems.length > 0) {
            fetchAddresses();
        }
    }, [cartItems]);

    const handleRemove = async (itemId: string, color: string, size: string) => {
        try {
            await removeFromCart(itemId, color, size);
            await refreshCart();
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const handleIncrease = async (itemId: string, color: string, size: string) => {
        try {
            await incrementQuantity(itemId, color, size);
            await refreshCart();
        } catch (error) {
            console.error("Error increasing cart item quantity:", error);
        }
    };

    const handleDecrease = async (itemId: string, color: string, size: string) => {
        try {
            await decrementQuantity(itemId, color, size);
            await refreshCart();
        } catch (error) {
            console.error("Error decreasing cart item quantity:", error);
        }
    };

    const handleCreateOrder = async () => {
        if (!selectedAddress) {
            setError('Please select a shipping address');
            return;
        }

        try {
            await createOrder({
                id: newOrderSlug,
                shippingCost: shippingCost,
                addressId: selectedAddress,
                paymentMethod: paymentMethod
            });

            router.push(`/user/${userSlug}/newOrder/${newOrderSlug}/confirmation`);
        } catch (err) {
            setError('Failed to place order' + err);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <CommonHeader
                    categoryVisibility="visible"
                    searchBarWidth="64"
                    isSearchAvailable={true}
                />
                <Card className="rounded-none mt-24">
                    <CardContent className="p-6">
                        <div className={"flex justify-center items-center h-64"}>
                            <div className={"animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"} />
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
                            className="mt-4"
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
            <div className="container mx-auto px-2 md:px-4 p-4 min-h-screen">
                <Card className="rounded-none mt-20 md:mt-28 w-full max-w-7xl mx-auto">
                    <CardHeader className="px-6 py-4 border-b">
                        <nav className="flex text-sm text-gray-500 space-x-2">
                            <a href="/home" className="hover:text-gray-800">Home</a>
                            <span>/</span>
                            <p className="hover:text-gray-800">New Order</p>
                        </nav>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 space-y-4 lg:space-y-0">
                            <OrderSummary
                                cartItems={cartItems}
                                handleDecrease={handleDecrease}
                                handleIncrease={handleIncrease}
                                handleRemove={handleRemove}
                                subtotal={subtotal}
                                shippingCost={shippingCost}
                                totalAmount={totalAmount}
                                cartItemCount={cartItemCount}
                            />

                            <div className="w-full lg:w-1/2 space-y-4">
                                <ShippingAddress
                                    addresses={addresses}
                                    selectedAddress={selectedAddress}
                                    onAddressChange={setSelectedAddress}
                                    onAddressAdded={fetchAddresses}
                                />

                                <PaymentMethodComponent
                                    paymentMethod={paymentMethod}
                                    onPaymentMethodChange={setPaymentMethod}
                                />

                                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                    <div className="text-lg font-bold w-full text-center sm:text-left">
                                        Total: Rs.{totalAmount.toFixed(2)}
                                    </div>
                                    <Button
                                        onClick={handleCreateOrder}
                                        disabled={!selectedAddress || cartItems.length === 0}
                                        className="w-full sm:w-auto rounded-none"
                                        size="lg"
                                    >
                                        Place Order
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}