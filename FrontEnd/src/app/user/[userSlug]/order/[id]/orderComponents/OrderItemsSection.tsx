import React from 'react';
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import { prefix } from "@/utils/apiConfig";
import { OrderResponse } from '@/api/admin/admin-order-api';

interface OrderItemsSectionProps {
    order: OrderResponse;
}

const OrderItemsSection: React.FC<OrderItemsSectionProps> = ({ order }) => {

    return (
        <div className="bg-white rounded-none p-4 border">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">Order Items</h2>
                <p className="text-sm text-gray-500">{order.orderItems.length} items in total</p>
            </div>

            <div className="space-y-4 mb-6">
                {order.orderItems.map((item) => (
                    <div key={item.id} className="flex border-b pb-4 items-center space-x-4">
                        <Image
                            src={prefix + item.product.cardImageUrl}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover border-2"
                            width={100}
                            height={100}
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    <p className="text-muted-foreground">
                                        Size: {item.selectedSize}
                                        <span className="flex items-center mt-1">
                                            Color:
                                            <div
                                                style={{ backgroundColor: item.selectedColour.slice(0, 7) }}
                                                className="rounded-full ml-2 border-4 border-neutral-300 p-2 h-6 w-6"
                                            />
                                            <span className="ml-2">{item.selectedColour.slice(8)}</span>
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-bold">
                                    ${item.subTotal.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Separator />

            <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${order.shippingCost.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderItemsSection;