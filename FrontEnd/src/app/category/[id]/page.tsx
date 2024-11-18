"use client";

import { useEffect, useState } from "react";
import { ProductCardResponse } from "@/api/product-api";
import { getAllProductsByCategory } from "@/api/product-api";
import ProductGrid from "@/app/components/ProductGrid";
import  {Pagination} from "@/app/components/PaginationComponent";
import CommonHeader from "@/app/components/Header";

export default function CategoryPage({ params }: { params: { id: string } }) {
    const [products, setProducts] = useState<ProductCardResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 15; // Products per page

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

    return (
        <div>
            <CommonHeader categoryVisibility={"visible"} searchBarWidth={"64"}/>
            <div className="container max-w-[1200px] mx-auto px-4 py-8">
                <div className="mb-4 mt-20">
                    <p className="text-gray-600">
                        Showing {products.length} of {totalElements} products
                    </p>
                </div>

                <ProductGrid products={products} loading={loading} />

                {/*{totalPages > 1 && ()}*/}
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage + 1}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
            </div>
        </div>
    );
}