"use client";

import { useEffect, useState } from "react";
import { ProductCardResponse } from "@/api/product-api";
import { getAllProductsByCategory } from "@/api/product-api";
import ProductGrid from "@/app/components/ProductGrid";
import  {Pagination} from "@/app/components/PaginationComponent";

export default function CategoryPage({ params }: { params: { id: string } }) {
    const [products, setProducts] = useState<ProductCardResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 12; // Products per page

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getAllProductsByCategory(
                    params.id,
                    currentPage,
                    pageSize,
                    'createdAt'
                );
                setProducts(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [params.id, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page - 1); // Convert to 0-based index for API
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <p className="text-gray-600">
                    Showing {products.length} of {totalElements} products
                </p>
            </div>

            <ProductGrid products={products} />

            {/*{totalPages > 1 && ()}*/}
                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>

        </div>
    );
}