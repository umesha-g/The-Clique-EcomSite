import {
  getAllOrders,
  OrderResponse,
  OrderStatusRequest,
  updateOrderStatus,
} from '@/api/admin/admin-order-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';

const OrdersPanel: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders(page);
      setOrders(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const request: OrderStatusRequest = { status: newStatus };
      await updateOrderStatus(orderId, request);
      fetchOrders();
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.status}</TableCell>
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
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between mt-4">
          <Button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersPanel;
