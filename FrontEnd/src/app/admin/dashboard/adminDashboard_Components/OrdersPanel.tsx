import {
  getAllOrders,
  OrderResponse,
  OrderStatus,
  OrderStatusRequest,
  updateOrderStatus,
} from '@/api/admin/admin-order-api';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import React, {useCallback, useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import debounce from "lodash/debounce";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

const OrdersPanel: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [status,setStatus] = useState("ALL");

  const debouncedSearch = useCallback(
      debounce((term: string, status : string) => {
        fetchOrders(term , status);
      }, 500),
      []
  );

  useEffect(() => {
    fetchOrders('',"ALL");
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm , status);
  }, [searchTerm, currentPage, debouncedSearch,status]);

  const fetchOrders = async (searchTerm: string = '',status : string) => {
    try {
      const orderStatus = status as OrderStatus;
      const response = await getAllOrders(currentPage,pageSize,'createdAt', searchTerm,orderStatus);
      setOrders(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const request: OrderStatusRequest = { status: newStatus };
      await updateOrderStatus(orderId, request);
      await fetchOrders('', status);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Orders Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={'flex rounded-none mb-12'}>
          <Input
            placeholder="Search Orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" mr-5 rounded-none"
        />
          <Select onValueChange={(value) =>{
              setStatus(value)}
          }>
            <SelectTrigger className="w-[200px] rounded-none">
              <SelectValue placeholder="Status"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Canceled</SelectItem>
              <SelectItem value="RETURNED">Returned</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Tracking Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Estimated Delivery Date</TableHead>
              <TableHead>Order Amount</TableHead>
              <TableHead>Shipping Cost</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Ordered Items</TableHead>
              <TableHead>Delivery Address</TableHead>
              <TableHead>Order Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.trackingNumber}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.estimatedDeliveryDate}</TableCell>
                <TableCell>Rs. {order.totalAmount}</TableCell>
                <TableCell>Rs. {order.shippingCost}</TableCell>
                <TableCell>Rs. {order.totalAmount + order.shippingCost}</TableCell>
                <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="link">{order.orderItems.length > 0 ? (order.orderItems.length) : (0) } items</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60" >
                        {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                            order.orderItems.map((item) => (
                        <p key={item.product.id}>{item.product.name} Rs.{item.product.price} {item.quantity}</p>))):("")}
                      </PopoverContent>
                    </Popover>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="link">{order.shippingAddress.addressType} Address</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60">
                      <p >{order.shippingAddress.receiverName}</p>
                      <p className={'mb-2'}>{order.shippingAddress.phoneNumber}</p>
                      <p>{order.shippingAddress.addressLine},</p>
                      <p>{order.shippingAddress.city},</p>
                      <p>{order.shippingAddress.province},</p>
                      <p>{order.shippingAddress.country}.</p>
                      <p className={'mb-2'}>{order.shippingAddress.postalCode}</p>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>{order.createdAt}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) =>
                      handleStatusChange(order.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Canceled</SelectItem>
                      <SelectItem value="RETURNED">Returned</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Total items: {totalElements}
          </div>
          <div className="flex gap-2">
            <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                variant="outline"
                className={"rounded-none"}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 ">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                variant="outline"
                className={"rounded-none"}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersPanel;
