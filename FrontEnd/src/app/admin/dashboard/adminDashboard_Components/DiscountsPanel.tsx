import React, { useEffect, useState } from 'react';
import {
  createDiscount,
  deleteDiscount,
  updateDiscount,
  DiscountRequest,
  DiscountResponse,
  getAllDiscounts, updateDiscountState,
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
import {Textarea} from "@/components/ui/textarea";

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
      await fetchDiscounts();
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
    });
  };

  const handleStateChange = async (id: string , newState:Boolean)=>{
    try{
      await updateDiscountState(id,newState);
      await fetchDiscounts();
    }
    catch (error) {
    console.error('Error deleting discount:', error);
    }
  }

  const handleDeleteDiscount = async (id: string) => {
    try {
      await deleteDiscount(id);
      await fetchDiscounts();
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
          <h4 className={'mb-4 mt-4'}>Add/Update Discounts</h4>
          <div className="mb-12 grid grid-cols-2 gap-4">
            <Input
                placeholder="Name"
                value={formData.name}
                className={"rounded-none"}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Percentage"
              value={formData.discountPercentage}
              className={"rounded-none"}
              onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPercentage: Number(e.target.value),
                  })
              }
          />
            <Textarea
                placeholder="Description"
                className={"col-span-2 rounded-none"}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Input
                type="date"
                placeholder="Valid From"
                value={formData.startDate}
                className={"rounded-none"}
                onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                }
            />
            <Input
                type="date"
                placeholder="Valid To"
                value={formData.endDate}
                className={"rounded-none"}
                onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                }
            />
            <div className="space-x-2 col-span-2">
              <Button onClick={handleSubmit} className={"rounded-none"}>
                {isEditing ? 'Update Discount' : 'Create Discount'}
              </Button>
              {isEditing && (
                  <Button variant="outline" onClick={resetForm} className={"rounded-none"}>
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
                    <TableCell>
                        <Button
                          onClick={() => handleStateChange(discount.id , !discount.active)}
                          variant={discount.active ? "default": "ghost"}
                          className={` ${discount.active ? 'bg-green-600':''} rounded-none`}
                      >
                        {discount.active ? "Active": "Inactive"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button
                            onClick={() => handleEdit(discount)}
                            variant="default"
                            className="mr-2 rounded-none"
                        >
                          Edit
                        </Button>
                        <Button
                            onClick={() => handleDeleteDiscount(discount.id)}
                            variant="destructive"
                            className=" rounded-none"
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