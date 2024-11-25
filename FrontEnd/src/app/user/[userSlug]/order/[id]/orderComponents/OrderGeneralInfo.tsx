import React from 'react';
import { Clock, MapPin, Package } from 'lucide-react';
import { OrderResponse } from '@/api/admin/admin-order-api';
import OrderItemsSection from "./OrderItemsSection";
import OrderTimeline from "./timeLine";

interface OrderGeneralInfoProps {
    order: OrderResponse;
}

const OrderGeneralInfo: React.FC<OrderGeneralInfoProps> = ({ order }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border rounded-none p-4">
                <h2 className="text-xl font-semibold mb-4">Order Information</h2>

                <div className="hidden sm:block mb-6">
                    <OrderTimeline status={order.status} />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span>
                            Estimated Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                            <p className="font-medium">Delivery Address</p>
                            <p className="text-gray-600">
                                {order.shippingAddress.addressLine},<br />
                                {order.shippingAddress.city}, {order.shippingAddress.province},<br />
                                {order.shippingAddress.postalCode}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-gray-500" />
                        <span>Last Updated: {new Date(order.updatedAt).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <OrderItemsSection order={order} />
        </div>
    );
};

export default OrderGeneralInfo;