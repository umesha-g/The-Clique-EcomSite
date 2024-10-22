import React, { useEffect, useState } from 'react';
import {
  createDiscount,
  deleteDiscount,
  updateDiscount,
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

const DiscountsPanel: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountResponse[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DiscountRequest>({
    name: '',
    description: '',
    discountPercentage: 0,
    startDate: '',
    endDate: '',
    applicableCategoryIds: [''],
    isActive: true,
  });

  // Convert ISO string to YYYY-MM-DD format for input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  // Convert YYYY-MM-DD to ISO string with time for backend
  const formatDateForBackend = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  };

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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      discountPercentage: 0,
      startDate: '',
      endDate: '',
      applicableCategoryIds: [''],
      isActive: true,
    });
    setIsEditing(false);
    setSelectedDiscountId(null);
  };

  const handleSubmit = async () => {
    try {
      // Prepare the request data with converted dates
      const requestData = {
        ...formData,
        startDate: formatDateForBackend(formData.startDate),
        endDate: formatDateForBackend(formData.endDate),
      };

      if (isEditing && selectedDiscountId) {
        await updateDiscount(selectedDiscountId, requestData);
      } else {
        await createDiscount(requestData);
      }
      fetchDiscounts();
      resetForm();
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  };

  const handleEdit = (discount: DiscountResponse) => {
    setIsEditing(true);
    setSelectedDiscountId(discount.id);
    setFormData({
      name: discount.name,
      description: discount.description,
      discountPercentage: discount.discountPercentage,
      startDate: formatDateForInput(discount.startDate),
      endDate: formatDateForInput(discount.endDate),
      applicableCategoryIds: [''],
      isActive: discount.isActive,
    });
  };

  const handleDeleteDiscount = async (id: string) => {
    try {
      await deleteDiscount(id);
      fetchDiscounts();
      if (selectedDiscountId === id) {
        resetForm();
      }
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
          <div className="mb-4 space-y-4">
            <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
                type="number"
                placeholder="Percentage"
                value={formData.discountPercentage}
                onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercentage: Number(e.target.value),
                    })
                }
            />
            <Input
                type="date"
                placeholder="Valid From"
                value={formData.startDate}
                onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                }
            />
            <Input
                type="date"
                placeholder="Valid To"
                value={formData.endDate}
                onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                }
            />
            <div className="space-x-2">
              <Button onClick={handleSubmit}>
                {isEditing ? 'Update Discount' : 'Create Discount'}
              </Button>
              {isEditing && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
              )}
            </div>
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
                    <TableCell>{formatDateForInput(discount.startDate)}</TableCell>
                    <TableCell>{formatDateForInput(discount.endDate)}</TableCell>
                    <TableCell>{discount.isActive ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button
                            onClick={() => handleEdit(discount)}
                            variant="secondary"
                            className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                            onClick={() => handleDeleteDiscount(discount.id)}
                            variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
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