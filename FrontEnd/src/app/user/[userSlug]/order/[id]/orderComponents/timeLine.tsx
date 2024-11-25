import {OrderStatus} from "@/api/admin/admin-order-api";
import React from "react";
import {OrderStatusProps} from "@/app/user/[userSlug]/order/[id]/page";

const OrderTimeline = ({ status }: OrderStatusProps) => {
    const steps = [
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.PROCESSING,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED
    ];
    const currentStep = steps.indexOf(status);

    return (
        <div className="flex items-center w-full mt-4">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'
                        }`}>
                            {index <= currentStep ? '✓' : index + 1}
                        </div>
                        <span className="text-xs mt-2 text-center">{step}</span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`h-1 flex-1 ${
                            index < currentStep ? 'bg-primary' : 'bg-gray-200'
                        }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default OrderTimeline;