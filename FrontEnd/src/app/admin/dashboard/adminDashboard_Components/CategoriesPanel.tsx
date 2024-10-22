import {
  CategoryRequest,
  CategoryResponse,
  createCategory,
  deleteCategory,
} from '@/api/admin/admin-category-api';
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

const CategoriesPanel: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [newCategory, setNewCategory] = useState<CategoryRequest>({ name: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    // This function is not provided in the API, so you'll need to implement it
    // For now, we'll use a placeholder
    setCategories([]);
  };

  const handleCreateCategory = async () => {
    try {
      await createCategory(newCategory);
      fetchCategories();
      setNewCategory({ name: '' });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // const handleUpdateCategory = async (
  //   id: string,
  //   updatedCategory: CategoryRequest,
  // ) => {
  //   try {
  //     await updateCategory(id, updatedCategory);
  //     fetchCategories();
  //   } catch (error) {
  //     console.error('Error updating category:', error);
  //   }
  // };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      fetchCategories();
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
        <div className="mb-4">
          <Input
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="mb-2"
          />
          <Button onClick={handleCreateCategory}>Create Category</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteCategory(category.id)}
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

export default CategoriesPanel;
