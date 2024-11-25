import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderHeaderProps {
    userSlug: string;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ userSlug }) => {
    const router = useRouter();

    return (
        <div className="px-6 py-6 border-b">
            <nav className="flex text-sm text-gray-500 space-x-2 ">
                <a href="/home" className="hover:text-gray-800">Home</a>
                <span>/</span>
                <a href={`/user/${userSlug}/orders`} className="hover:text-gray-800">Orders</a>
                <span>/</span>
                <span className="text-gray-800">Order Details</span>
            </nav>
        </div>
    );
};

export default OrderHeader;