import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CreditCard, Package } from 'lucide-react';
import { FaCheck } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { PaymentMethod as PaymentMethodEnum } from "@/api/order-api";

interface PaymentMethodProps {
    paymentMethod: PaymentMethodEnum;
    onPaymentMethodChange: (method: PaymentMethodEnum) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
                                                                paymentMethod,
                                                                onPaymentMethodChange
                                                            }) => {
    const paymentMethodOptions = [
        {
            method: PaymentMethodEnum.CREDIT_CARD,
            icon: CreditCard,
            label: "Credit Card"
        },
        {
            method: PaymentMethodEnum.COD,
            icon: Package,
            label: "Cash on Delivery"
        },
        {
            method: PaymentMethodEnum.BANK,
            icon: BsBank2,
            label: "Bank Deposit"
        }
    ];

    return (
        <Card className="mt-4 rounded-none">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                    Payment Method
                </CardTitle>
                <CardDescription>
                    Select your payment method
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4">
                    {paymentMethodOptions.map(({ method, icon: Icon, label }) => (
                        <div
                            key={method}
                            className={`flex items-center justify-between p-3 border rounded-none cursor-pointer transition-colors 
                                ${paymentMethod === method
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:bg-gray-50'}`}
                            onClick={() => onPaymentMethodChange(method)}
                        >
                            <div className="flex items-center space-x-4">
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                <span className="text-sm sm:text-base">{label}</span>
                            </div>
                            {paymentMethod === method && (
                                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center">
                                    <FaCheck className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};