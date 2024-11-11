import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import BrandDetailsForm from './BrandDetailsForm';
import { BrandRequest, BrandResponse, createBrand, updateBrand } from '@/api/admin/admin-brand-api';

interface AddEditBrandDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brand: BrandResponse | null;
    onSuccess: () => void;
}

const AddEditBrandDialog: React.FC<AddEditBrandDialogProps> = ({
                                                                   open,
                                                                   onOpenChange,
                                                                   brand,
                                                                   onSuccess,
                                                               }) => {
    const [brandData, setBrandData] = useState<BrandRequest | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            if (brand) {
                setBrandData({
                    name: brand.name,
                    description: brand.description,
                    discountId: brand.discount?.id || '',
                    logoFile: null,
                    existingLogoUrl: brand.logoUrl,
                });
            } else {
                setBrandData(null);
            }
        }
    }, [open, brand]);

    const handleSubmit = async (data: BrandRequest) => {
        try {
            if(data.discountId==" ")
            {
                data.discountId="";
            }
            if (brand) {
                await updateBrand(brand.id, data);
                toast({
                    title: "Success",
                    description: "Brand updated successfully",
                });
            } else {
                await createBrand(data);
                toast({
                    title: "Success",
                    description: "Brand created successfully",
                });
            }
            onSuccess();
            onOpenChange(false);
            setBrandData(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save brand",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-none">
                <DialogHeader>
                    <DialogTitle>
                        {brand ? 'Edit Brand' : 'Add New Brand'}
                    </DialogTitle>
                </DialogHeader>
                <BrandDetailsForm
                    initialData={brandData}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddEditBrandDialog;