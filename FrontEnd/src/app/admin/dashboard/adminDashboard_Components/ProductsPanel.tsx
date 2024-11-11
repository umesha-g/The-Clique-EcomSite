import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductTable from './productPanelComponents/ProductTable';
import AddEditProductDialog from './productPanelComponents/AddEditProductDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { ProductResponse, getAllProducts, deleteProduct } from '@/api/admin/admin-product-api';
import { useToast } from '@/hooks/use-toast';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const ProductsPanel: React.FC = () => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const { toast } = useToast();

    const fetchProducts = async () => {
        try {
            const response = await getAllProducts(currentPage, 10, 'createdAt', searchTerm);
            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch products",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, searchTerm]);

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsAddDialogOpen(true);
    };

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
            fetchProducts();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product",
                variant: "destructive"
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedProduct(null);
        }
    };

    return (
        <div className="space-y-4 rounded-none">

            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Products Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center rounded-none">
                        <Input
                            placeholder="Search products..."
                            className="max-w-sm rounded-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button className={"rounded-none"} onClick={handleAddProduct}>
                            Add Product
                        </Button>
                    </div>

                    <ProductTable
                        products={products}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteClick}
                    />
                    </CardContent>
            </Card>


    <AddEditProductDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                product={selectedProduct}
                onSuccess={() => {
                    fetchProducts();
                    setIsAddDialogOpen(false);
                }}
            />

            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default ProductsPanel;