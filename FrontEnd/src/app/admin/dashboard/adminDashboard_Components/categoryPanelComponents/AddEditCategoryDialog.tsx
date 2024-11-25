import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CategoryRequest, CategoryResponse, createCategory, updateCategory } from '@/api/admin/admin-category-api';
import CategoryDetailsForm from './CategoryDetailsForm';

interface AddEditCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: CategoryResponse | null;
    onSuccess: () => void;
}

const AddEditCategoryDialog: React.FC<AddEditCategoryDialogProps> = ({
                                                                         open,
                                                                         onOpenChange,
                                                                         category,
                                                                         onSuccess,
                                                                     }) => {
    const [categoryData, setCategoryData] = useState<CategoryRequest | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (open && category) {
            setCategoryData({
                name: category.name,
                description: category.description,
                discountId: category.discount?.id || '',
            });
        } else {
            setCategoryData(null);
        }
    }, [open, category]);

    const handleSubmit = async (data: CategoryRequest) => {
        try {
            if(data.discountId==" ")
            {
                data.discountId="";
            }
            if (category) {
                await updateCategory(category.id, data);
                toast({
                    title: "Success",
                    description: "Category updated successfully"
                });
            } else {
                await createCategory(data);
                toast({
                    title: "Success",
                    description: "Category created successfully"
                });
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save category details"+error,
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-none">
                <DialogHeader>
                    <DialogTitle>
                        {category ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                </DialogHeader>
                <CategoryDetailsForm
                    initialData={categoryData}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddEditCategoryDialog;