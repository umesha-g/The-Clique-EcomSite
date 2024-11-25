import {
  getAllOrders,
  OrderResponse,
  OrderStatus,
  OrderStatusRequest,
  updateOrderStatus,
} from '@/api/admin/admin-order-api';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import React, {useCallback, useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import debounce from "lodash/debounce";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Pagination} from "@/app/components/PaginationComponent";

const OrdersPanel: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
      const response = await getAllOrders(currentPage,15,'createdAt', searchTerm,orderStatus);
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
    <Card className="rounded-none w-[1500px] h-auto">
      <CardHeader>
        <CardTitle className={"text-xl"}>Orders Management</CardTitle>
        <CardDescription>{totalElements} orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={'flex justify-between mb-10'}>
          <Input
            placeholder="Search Orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" max-w-sm rounded-none"
        />
          <Select onValueChange={(value) =>{
              setStatus(value)}
          }>
            <SelectTrigger className="w-[200px] rounded-none">
              <SelectValue placeholder="Status"/>
            </SelectTrigger>
            <SelectContent className={"rounded-none"}>
              <SelectItem className={"rounded-none"} value="ALL">All</SelectItem>
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
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Est. Delivery Date</TableHead>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 &&
          <div className="mt-8 flex justify-center">
            <Pagination
                currentPage = {currentPage + 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
          </div>
        }

      </CardContent>
    </Card>
  );
};

export default OrdersPanel;
