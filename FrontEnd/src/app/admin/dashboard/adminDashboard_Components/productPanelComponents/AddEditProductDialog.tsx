import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ProductDetailsForm from './ProductDetailsForm';
import ProductImagesForm from './ProductImagesForm';
import { ProductRequest, ProductResponse, createProduct, updateProduct } from '@/api/admin/admin-product-api';

interface AddEditProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: ProductResponse | null;
    onSuccess: () => void;
}

const AddEditProductDialog: React.FC<AddEditProductDialogProps> = ({
                                                                       open,
                                                                       onOpenChange,
                                                                       product,
                                                                       onSuccess,
                                                                   }) => {
    const [step, setStep] = useState(1);
    const [productId, setProductId] = useState<string | null>(null);
    const [productData, setProductData] = useState<ProductRequest | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            setStep(1);
            setProductId(product?.id || null);
            if (product) {
                setProductData({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    description: product.description,
                    brandId: product.brand?.id,
                    categoryId: product.category.id,
                    discountId: product.directDiscount?.id,
                    gender: product.gender,
                    sizes: product.sizes,
                    colors: product.colors,
                });
            } else {
                setProductData(null);
            }
        }
    }, [open, product]);

    const handleDetailsSubmit = async (data: ProductRequest) => {
        try {
            if(data.discountId==" ") {data.discountId="";}
            if(data.brandId==" ") {data.brandId="";}
            if (productId) {
                await updateProduct(productId, data);
            } else {
                const response = await createProduct(data);
                setProductId(response.id);
            }
            setProductData(data);
            setStep(2);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save product details",
                variant: "destructive"
            });
        }
    };

    const handleComplete = () => {
        onSuccess();
        onOpenChange(false);
        setStep(1);
        setProductId(null);
        setProductData(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="max-w-4xl max-h-[800px] h-full overflow-y-scroll rounded-none">
                <DialogHeader>
                    <DialogTitle>
                        {product ? 'Edit Product' : 'Add New Product'} - Step {step} of 2
                    </DialogTitle>
                </DialogHeader>

                {step === 1 && (
                    <ProductDetailsForm
                        initialData={productData}
                        onSubmit={handleDetailsSubmit}
                    />
                )}

                {step === 2 && productId && (
                    <ProductImagesForm
                        productId={productId}
                        onComplete={handleComplete}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddEditProductDialog;