import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ProductResponse } from '@/api/admin/admin-product-api';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {prefix} from "@/utils/apiConfig";

interface ProductTableProps {
    products: ProductResponse[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (product: ProductResponse) => void;
    onDelete: (product: ProductResponse) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
                                                       products,
                                                       currentPage,
                                                       totalPages,
                                                       onPageChange,
                                                       onEdit,
                                                       onDelete,
                                                   }) => {
    return (
        <div className="space-y-4 mt-10">
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
                        <TableRow key={product.id}>
                            <TableCell>
                                <img
                                    src={prefix + product.cardImageUrl}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-none"
                                />
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{product.category.name}</TableCell>
                            <TableCell>{product.brand?.name}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell className="space-x-2">
                                <Button
                                    className={"rounded-none"}
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onEdit(product)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    className={"rounded-none"}
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onDelete(product)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className={"rounded-none"}
                            onClick={() => onPageChange(currentPage - 1)}
                            isActive={currentPage === 0}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink
                                onClick={() => onPageChange(i)}
                                isActive={!(currentPage === i)}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            className={"rounded-none"}
                            onClick={() => onPageChange(currentPage + 1)}
                            isActive={!(currentPage === totalPages - 1)}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default ProductTable;