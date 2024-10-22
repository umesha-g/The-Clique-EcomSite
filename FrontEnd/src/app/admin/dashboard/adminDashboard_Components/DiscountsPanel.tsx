import {
  createDiscount,
  deleteDiscount,
  DiscountRequest,
  DiscountResponse,
  getAllDiscounts,
} from '@/api/admin/admin-discount-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';

const DiscountsPanel: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountResponse[]>([]);
  const [newDiscount, setNewDiscount] = useState<DiscountRequest>({
    name: '',
    description: '',
    discountPercentage: 0,
    startDate: '',
    endDate: '',
    applicableCategoryIds: [''],
    applicableProductIds: [''],
    isActive: true,
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await getAllDiscounts();
      setDiscounts(response);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const handleCreateDiscount = async () => {
    try {
      await createDiscount(newDiscount);
      fetchDiscounts();
      setNewDiscount({
        name: '',
        description: '',
        discountPercentage: 0,
        startDate: '',
        endDate: '',
        applicableCategoryIds: [''],
        applicableProductIds: [''],
        isActive: true,
      });
    } catch (error) {
      console.error('Error creating discount:', error);
    }
  };

  // const handleUpdateDiscount = async (
  //   id: string,
  //   updatedDiscount: DiscountRequest,
  // ) => {
  //   try {
  //     await updateDiscount(id, updatedDiscount);
  //     fetchDiscounts();
  //   } catch (error) {
  //     console.error('Error updating discount:', error);
  //   }
  // };

  const handleDeleteDiscount = async (id: string) => {
    try {
      await deleteDiscount(id);
      fetchDiscounts();
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Discounts Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Name"
            value={newDiscount.name}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, name: e.target.value })
            }
            className="mb-2"
          />
          <Input
            type="number"
            placeholder="Percentage"
            value={newDiscount.discountPercentage}
            onChange={(e) =>
              setNewDiscount({
                ...newDiscount,
                discountPercentage: Number(e.target.value),
              })
            }
            className="mb-2"
          />
          <Input
            type="date"
            placeholder="Valid From"
            value={newDiscount.startDate}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, startDate: e.target.value })
            }
            className="mb-2"
          />
          <Input
            type="date"
            placeholder="Valid To"
            value={newDiscount.endDate}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, endDate: e.target.value })
            }
            className="mb-2"
          />
          <Button onClick={handleCreateDiscount}>Create Discount</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell>{discount.name}</TableCell>
                <TableCell>{discount.description}</TableCell>
                <TableCell>{discount.discountPercentage}%</TableCell>
                <TableCell>{discount.startDate}</TableCell>
                <TableCell>{discount.endDate}</TableCell>
                <TableCell>{discount.isActive}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteDiscount(discount.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DiscountsPanel;
