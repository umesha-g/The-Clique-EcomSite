import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Truck } from 'lucide-react';
import { OrderStatus } from '@/api/admin/admin-order-api';
import {OrderStatusProps, StatusConfig} from "@/app/user/[userSlug]/order/[id]/page";

const OrderStatusBadge = ({ status }: OrderStatusProps) => {
    const getStatusConfig = (status: OrderStatus): StatusConfig => {
        const configs: Record<OrderStatus, StatusConfig> = {
            [OrderStatus.ALL]: {color:'bg-gray-500'},
            [OrderStatus.PENDING]: { color: 'bg-yellow-500' },
            [OrderStatus.CONFIRMED]: { color: 'bg-blue-500' },
            [OrderStatus.PROCESSING]: { color: 'bg-purple-500' },
            [OrderStatus.SHIPPED]: { color: 'bg-indigo-500', icon: <Truck className="w-4 h-4 mr-1" /> },
            [OrderStatus.DELIVERED]: { color: 'bg-green-500' },
            [OrderStatus.CANCELLED]: { color: 'bg-red-500' },
            [OrderStatus.RETURNED]: { color: 'bg-orange-500' },
            [OrderStatus.REFUNDED]: { color: 'bg-pink-500' },
            [OrderStatus.FAILED]: { color: 'bg-red-700' }
        };

        return configs[status] || { color: 'bg-gray-500' };
    };

    const config = getStatusConfig(status);
    return (
        <Badge className={`${config.color} text-white rounded-full mt-4 sm:mt-0 flex items-center`}>
            {config.icon}
            {status}
        </Badge>
    );
};

export default OrderStatusBadge;