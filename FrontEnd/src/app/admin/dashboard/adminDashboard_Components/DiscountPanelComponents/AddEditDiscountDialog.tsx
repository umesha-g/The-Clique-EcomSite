import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {DiscountRequest, createDiscount, updateDiscount, DiscountResponse} from '@/api/admin/admin-discount-api';
import DiscountDetailsForm from './DiscountDetailsForm';

interface AddEditDiscountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    discount: DiscountResponse | null; // Replace 'any' with your DiscountResponse type
    onSuccess: () => void;
}

const AddEditDiscountDialog: React.FC<AddEditDiscountDialogProps> = ({
                                                                         open,
                                                                         onOpenChange,
                                                                         discount,
                                                                         onSuccess,
                                                                     }) => {
    const [discountData, setDiscountData] = useState<DiscountRequest | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (open && discount) {
            setDiscountData({
                name: discount.name,
                description: discount.description,
                discountPercentage: discount.discountPercentage,
                startDate: new Date(discount.startDate).toISOString().split('T')[0],
                endDate: new Date(discount.endDate).toISOString().split('T')[0],
            });
        } else {
            setDiscountData(null);
        }
    }, [open, discount]);

    const handleSubmit = async (data: DiscountRequest) => {
        try {
            if (discount) {
                await updateDiscount(discount.id, data);
                toast({
                    title: "Success",
                    description: "Discount updated successfully"
                });
            } else {
                await createDiscount(data);
                toast({
                    title: "Success",
                    description: "Discount created successfully"
                });
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save discount details"+error,
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-none">
                <DialogHeader>
                    <DialogTitle>
                        {discount ? 'Edit Discount' : 'Add New Discount'}
                    </DialogTitle>
                </DialogHeader>
                <DiscountDetailsForm
                    initialData={discountData}
                    onSubmit={handleSubmit}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddEditDiscountDialog;