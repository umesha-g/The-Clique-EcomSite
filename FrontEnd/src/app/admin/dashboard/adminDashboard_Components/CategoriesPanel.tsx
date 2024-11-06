import {
  CategoryRequest,
  CategoryResponse,
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/api/admin/admin-category-api';
import { getAllCategories} from "@/api/category-api";
import { getActiveDiscounts, MiniDiscountResponse } from '@/api/discount-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useEffect, useState } from 'react';

const CategoriesPanel: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [activeDiscounts, setActiveDiscounts] = useState<MiniDiscountResponse[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryRequest & {discountName?:string}>({
    name: '',
    description: '',
    discountId: '',
    discountName:'',
  });

  useEffect(() => {
    fetchCategories();
    fetchActiveDiscounts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchActiveDiscounts = async () => {
    try {
      const response = await getActiveDiscounts();
      setActiveDiscounts(response);
    } catch (error) {
      console.error('Error fetching active discounts:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      discountId: '',
      discountName:'',
    });
    setIsEditing(false);
    setSelectedCategoryId(null);
  };

  const handleSubmit = async () => {
    try {
      const newRequest : CategoryRequest = {name:formData.name, discountId: formData.discountId, description: formData.description}
      if(newRequest.discountId==" ")
      {
        newRequest.discountId="";
      }

      if (isEditing && selectedCategoryId) {
        await updateCategory(selectedCategoryId, newRequest);
      } else {
        await createCategory(newRequest);
      }
      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: CategoryResponse) => {
    setIsEditing(true);
    setSelectedCategoryId(category.id);
    setFormData({
      name: category.name,
      description: category.description,
      discountId: category.discount?.id,
      discountName:category.discount?.name,
    });
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      await fetchCategories();
      if (selectedCategoryId === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Categories Management</CardTitle>
        </CardHeader>
        <CardContent>
          <h4 className={'mb-4 mt-4'}>Add/Update Categories</h4>
          <div className="mb-12 grid grid-cols-2 gap-4">
            <Input
                placeholder="Name"
                value={formData.name}
                className="rounded-none"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Select
                value={formData.discountId || ''} // Add fallback for empty value
                onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      discountId: value,
                    })
                }
            >
              <SelectTrigger className="rounded-none">
                <SelectValue placeholder={formData.discountName || "Select a Discount"} />
              </SelectTrigger>
              <SelectContent className={"rounded-none"}>
                <SelectItem className={"rounded-none"} value=" ">No Discount</SelectItem> {/* Add option to clear discount */}
                {activeDiscounts.map((discount) => (
                    <SelectItem className={"rounded-none"} key={discount.id} value={discount.id}>
                      {discount.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Description"
              value={formData.description}
              className="rounded-none col-span-2"
              onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
              }
          />
            <div className="space-x-2 col-span-2">
              <Button onClick={handleSubmit} className="rounded-none">
                {isEditing ? 'Update Category' : 'Create Category'}
              </Button>
              {isEditing && (
                  <Button variant="outline" onClick={resetForm} className="rounded-none">
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
                <TableHead>Discount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="rounded-none">{category.name}</TableCell>
                    <TableCell className="rounded-none">{category.description}</TableCell>
                    <TableCell className="rounded-none">
                      {category.discount?.name}
                    </TableCell>
                    <TableCell className="rounded-none">
                      <div className="space-x-2">
                        <Button
                            onClick={() => handleEdit(category)}
                            variant="default"
                            className="mr-2 rounded-none"
                        >
                          Edit
                        </Button>
                        <Button
                            onClick={() => handleDeleteCategory(category.id)}
                            variant="destructive"
                            className="rounded-none"
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

export default CategoriesPanel;