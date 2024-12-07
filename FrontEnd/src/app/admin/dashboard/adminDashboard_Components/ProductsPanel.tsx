import React, { useState, useEffect } from 'react';
import {Edit, Trash2} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AddEditProductDialog from './productPanelComponents/AddEditProductDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { ProductResponse, getAllProducts, deleteProduct } from '@/api/admin/admin-product-api';
import { useToast } from '@/hooks/use-toast';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {prefix} from "@/utils/apiConfig";
import {Pagination} from "@/app/components/PaginationComponent";
import Image from "next/image";
import {useRouter} from "next/navigation";

const ProductsPanel: React.FC = () => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const fetchProducts = async () => {
        try {
            const response = await getAllProducts(currentPage, 15, 'createdAt', searchTerm);
            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch products"+error,
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page - 1); // Convert to 0-based index for API
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                description: "Failed to delete product"+error,
                variant: "destructive"
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setSelectedProduct(null);
        }
    };

    return (
            <Card className="rounded-none w-[1500px] h-auto">
                <CardHeader>
                    <CardTitle className={"text-xl"}>Products Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-10">
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

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow className={"cursor-pointer"} key={product.id}>
                                    <TableCell onClick={() => router.push(`/admin/dashboard/product/${product.id}/`)}>
                                        <Image
                                            src={prefix + product.cardImageUrl}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-none"
                                            width={100}
                                            height={100}
                                        />
                                    </TableCell>
                                    <TableCell onClick={() => router.push(`/admin/dashboard/product/${product.id}/`)}>{product.name}</TableCell>
                                    <TableCell onClick={() => router.push(`/admin/dashboard/product/${product.id}/`)}>Rs.{product.price}</TableCell>
                                    <TableCell onClick={() => router.push(`/admin/dashboard/product/${product.id}/`)}>{product.stock}</TableCell>
                                    <TableCell onClick={() => router.push(`/admin/dashboard/product/${product.id}/`)}>{product.category.name}</TableCell>
                                    <TableCell onClick={() => router.push(`/admin/dashboard/product/${product.id}/`)}>{product.brand?.name}</TableCell>
                                    <TableCell onClick={() => router.push(`/admin/dashboard/product/${product.id}/`)}>{product.rating}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            className={"rounded-none"}
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            className={"rounded-none"}
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteClick(product)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {totalPages > 1 &&
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage = {currentPage + 1}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    }
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
                        type={"Product"}
                    />
                </CardContent>
            </Card>
    );
};

export default ProductsPanel;