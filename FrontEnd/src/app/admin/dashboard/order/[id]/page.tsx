"use client";
import React, {useEffect, useState} from "react";
import {OrderResponse, OrderStatus, OrderStatusRequest, updateOrderStatus} from "@/api/admin/admin-order-api";
import {getOrder} from "@/api/order-api";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Clock, CreditCard, Package, Truck} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import CommonHeader from "@/app/components/CommonHeader";
import {Button} from "@/components/ui/button";
import {IoMdArrowBack} from "react-icons/io";
import {useRouter} from "next/navigation";


export default function AdminOrderDetails({params}: { params: { id: string } })
{
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const orderId = params.id;
    const router = useRouter();

    const getStatusColor = (status: OrderStatus) => {
        switch(status) {
            case OrderStatus.PENDING: return 'bg-yellow-500';
            case OrderStatus.CONFIRMED: return 'bg-blue-500';
            case OrderStatus.PROCESSING: return 'bg-purple-500';
            case OrderStatus.SHIPPED: return 'bg-indigo-500';
            case OrderStatus.DELIVERED: return 'bg-green-500';
            case OrderStatus.CANCELLED: return 'bg-black';
            case OrderStatus.RETURNED: return 'bg-orange-500';
            case OrderStatus.REFUNDED: return 'bg-pink-500';
            case OrderStatus.FAILED: return 'bg-red-700';
            default: return 'bg-gray-500';
        }
    };

    const fetchOrderDetails = async () => {
        try {
            const orderDetails = await getOrder(orderId);
            setOrder(orderDetails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching order details:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const request: OrderStatusRequest = { status: newStatus };
            await updateOrderStatus(orderId, request);
            await fetchOrderDetails();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>Order not found</p>
            </div>
        );
    }

    return (
        <div>
            <CommonHeader categoryVisibility={"hidden"} isSearchAvailable={false} searchBarWidth={""}/>
            <Button className="relative 2xl:left-[15vw] left-[5vw] top-4 rounded-none cursor-pointer z-50" variant={"outline"} onClick={() => router.push(`/admin/dashboard/`)}> <IoMdArrowBack /> Back </Button>
            <div className="container mx-auto p-4 space-y-6">
                <Card className="rounded-none mt-14">
                    <CardHeader className="flex flex-row items-center h-6 space-y-0 border-b">
                        <nav className="flex text-sm text-gray-500 space-x-2">
                            <a href="/admin/dashboard" className="hover:text-gray-800">Dashboard</a>
                            <span>/</span>
                            <span className="text-gray-500">Orders</span>
                            <span>/</span>
                            <span className="text-gray-800">#{order.id}</span>
                        </nav>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-row items-center justify-between space-y-0 mt-4">
                            <div className="space-y-1.5">
                                <CardTitle className="text-2xl">Order Details</CardTitle>
                                <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                            </div>
                            <div className={"flex space-x-4"}>
                                <Select
                                    onValueChange={(value) =>
                                        handleStatusChange(order.id, value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px] rounded-none">
                                        <SelectValue placeholder="Change status" />
                                    </SelectTrigger>
                                    <SelectContent className={"rounded-none"}>
                                        <SelectItem className={"rounded-none"} value="PENDING">Pending</SelectItem>
                                        <SelectItem className={"rounded-none"} value="CONFIRMED">Confirmed</SelectItem>
                                        <SelectItem className={"rounded-none"} value="PROCESSING">Processing</SelectItem>
                                        <SelectItem className={"rounded-none"} value="SHIPPED">Shipped</SelectItem>
                                        <SelectItem className={"rounded-none"} value="DELIVERED">Delivered</SelectItem>
                                        <SelectItem className={"rounded-none"} value="CANCELLED">Canceled</SelectItem>
                                        <SelectItem className={"rounded-none"} value="RETURNED">Returned</SelectItem>
                                        <SelectItem className={"rounded-none"} value="REFUNDED">Refunded</SelectItem>
                                        <SelectItem className={"rounded-none"} value="FAILED">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Badge
                                    className={`${getStatusColor(order.status)} px-3 py-1 rounded-full`}
                                >
                                    {order.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mt-10">
                            {/* Order Information */}
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center space-x-4">
                                    <Clock className="w-6 h-6" />
                                    <CardTitle className="text-lg">Order Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p><strong>Created At:</strong> {order.createdAt}</p>
                                        <p><strong>Updated At:</strong> {order.updatedAt}</p>
                                        <p><strong>Estimated Delivery:</strong> {order.estimatedDeliveryDate}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Details */}
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center space-x-4">
                                    <Truck className="w-6 h-6" />
                                    <CardTitle className="text-lg">Shipping Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p><strong>{order.shippingAddress.receiverName}</strong></p>
                                        <p>{order.shippingAddress.phoneNumber}</p>
                                        <p>{order.shippingAddress.addressLine}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                                        <p>{order.shippingAddress.country} - {order.shippingAddress.postalCode}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Financial Summary */}
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center space-x-4">
                                    <CreditCard className="w-6 h-6" />
                                    <CardTitle className="text-lg">Financial Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p><strong>Order Amount:</strong> Rs. {order.subTotal}</p>
                                        <p><strong>Shipping Cost:</strong> Rs. {order.shippingCost}</p>
                                        <p><strong>Total Amount:</strong> Rs. {order.totalAmount}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Items */}
                        <Card className="mt-6 rounded-none">
                            <CardHeader className="flex flex-row items-center space-x-4">
                                <Package className="w-6 h-6" />
                                <CardTitle className="text-lg">Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Color</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.orderItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.product.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell className={"flex items-center justify-start space-x-4"}>
                                                    <div
                                                        className={`w-8 h-8 rounded-full ring-1 ring-offset-2`}
                                                        style={{ backgroundColor: item.selectedColour.slice(0, 7) }}
                                                        >
                                                    </div>
                                                    <p>{item.selectedColour.slice(8)}</p>
                                               </TableCell>
                                                <TableCell>{item.selectedSize}</TableCell>
                                                <TableCell className="text-right">Rs. {item.subTotal}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};