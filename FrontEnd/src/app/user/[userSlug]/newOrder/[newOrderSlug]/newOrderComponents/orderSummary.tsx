import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NewOrderItem } from './newOrderItem';

interface OrderSummaryProps {
    cartItems: any[];
    handleDecrease: (itemId: string, color: string, size: string) => void;
    handleIncrease: (itemId: string, color: string, size: string) => void;
    handleRemove: (itemId: string, color: string, size: string) => void;
    subtotal: number;
    shippingCost: number;
    totalAmount: number;
    cartItemCount: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
                                                              cartItems,
                                                              handleDecrease,
                                                              handleIncrease,
                                                              handleRemove,
                                                              subtotal,
                                                              shippingCost,
                                                              totalAmount,
                                                              cartItemCount
                                                          }) => {
    return (
        <Card className={"w-full lg:w-1/2 rounded-none"}>
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">Order Summary</CardTitle>
                <CardDescription>{cartItemCount} items in cart</CardDescription>
            </CardHeader>
            <CardContent className={"px-4"}>
                <div className="space-y-4">
                    {cartItems.map((cartItem, index) => (
                        <NewOrderItem
                            key={index}
                            cartItem={cartItem}
                            onDecrease={handleDecrease}
                            onIncrease={handleIncrease}
                            onRemove={handleRemove}
                        />
                    ))}
                    <Separator className="my-2" />
                    <div className="space-y-2 text-sm sm:text-base">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>Rs.{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>Rs.{shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base md:text-lg">
                            <span>Total</span>
                            <span>Rs.{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
};