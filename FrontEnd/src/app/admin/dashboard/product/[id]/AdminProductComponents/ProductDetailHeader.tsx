import React, {useState} from 'react';
import { Button } from '@/components/ui/button';
import {Card, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import {deleteProduct, ProductResponse} from '@/api/admin/admin-product-api';
import AddEditProductDialog
    from "@/app/admin/dashboard/adminDashboard_Components/productPanelComponents/AddEditProductDialog";
import DeleteConfirmationDialog from "@/app/admin/dashboard/adminDashboard_Components/DeleteConfirmationDialog";
import {toast} from "@/hooks/use-toast";

export default function ProductDetailHeader({ product  , fetchProduct} : { product: ProductResponse , fetchProduct: () => void }) {
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleEditProduct = (product: ProductResponse) => {
        setSelectedProduct(product);
        setIsAddDialogOpen(true);
    };

    const handleDeleteClick = (product: ProductResponse) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;

        try {
            await deleteProduct(selectedProduct.id);
            toast({
                title: "Success",
                description: "Product deleted successfully",
            });
            fetchProduct();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product"+error,
                variant: "destructive"
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedProduct(null);
        }
    };

    return (
        <Card className="rounded-none border-transparent shadow-none mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className={"flex-col"}>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <CardDescription>Product #{product.id}</CardDescription>
                </div>
                <div className="flex space-x-2">
                    <Button
                        className="rounded-none"
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        className="rounded-none"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteClick(product)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <AddEditProductDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            product={selectedProduct}
            onSuccess={() => {
                fetchProduct();
                setIsAddDialogOpen(false);
            }}
            />

            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                type={"Product"}
            />
        </Card>


    );
}