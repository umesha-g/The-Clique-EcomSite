import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from "lucide-react";
import {CategoryResponse, deleteCategory, getAllCategoriesForAdmin} from '@/api/admin/admin-category-api';
import { useToast } from '@/hooks/use-toast';
import AddEditCategoryDialog from './categoryPanelComponents/AddEditCategoryDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const CategoriesPanel: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesForAdmin();
      setCategories(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories" + error,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  },[] );

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsAddDialogOpen(true);
  };

  const handleEditCategory = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setIsAddDialogOpen(true);
  };

  const handleDeleteClick = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory.id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      await fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category" + error,
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  return (
      <Card className="rounded-none w-[1500px]">
        <CardHeader>
          <CardTitle className={"text-xl"}>Categories Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-10">
            <Button onClick={handleAddCategory} className="rounded-none">
              Add Category
            </Button>
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
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      {category.discount?.name}
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button
                            onClick={() => handleEditCategory(category)}
                            variant="outline"
                            className="rounded-none"
                            size="icon"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => handleDeleteClick(category)}
                            variant="destructive"
                            className="rounded-none"
                            size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>

          <AddEditCategoryDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              category={selectedCategory}
              onSuccess={fetchCategories}
          />

          <DeleteConfirmationDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              onConfirm={handleDeleteConfirm}
              type={"Category"}
          />
        </CardContent>
      </Card>
  );
};

export default CategoriesPanel;