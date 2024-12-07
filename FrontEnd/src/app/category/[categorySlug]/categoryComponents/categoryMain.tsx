"use client";
import { useEffect, useState } from "react";
import { ProductCardResponse, getAllProductsByCategory } from "@/api/product-api";
import ProductGrid from "@/app/components/ProductGrid";
import { Pagination } from "@/app/components/PaginationComponent";
import {getCategoryById} from "@/api/category-api";
import {CategoryResponse} from "@/api/admin/admin-category-api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function CategoryMain({
                                           categoryId
                                       }: {
    categoryId: string
}) {
    const [products, setProducts] = useState<ProductCardResponse[]>([]);
    const [category,setCategory] = useState<CategoryResponse>();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 30;

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getCategoryById(
                    categoryId
                );
                setCategory(response);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getAllProductsByCategory(
                    categoryId,
                    currentPage,
                    pageSize,
                    "createdAt"
                );
                setProducts(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
        fetchProducts();
    }, [categoryId, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="container min-h-screen mx-auto px-4 py-8">
            <Card className="mb-4 mt-20 md:mt-28 rounded-none">
                <CardHeader className={"px-6 py-4 border-b"}>
                    <div className={""}>
                        <nav className="flex text-sm text-gray-500 space-x-2">
                            <a href="/home" className="hover:text-gray-800">Home</a>
                            <span>/</span>
                            <span
                                className="text-black"
                            >
                                {category?.name}
                            </span>
                        </nav>
                    </div>

                </CardHeader>
                <CardContent className={"p-2"}>
                    <CardTitle className={"mt-4"}>{category?.name}</CardTitle>
                    <CardDescription>{category?.description}</CardDescription>
                    <p className="text-gray-600 mt-8">
                        Showing {products.length} of {totalElements} products
                    </p>
                    <ProductGrid
                        products={products}
                        loading={loading}
                        cols={"grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"}
                        gap={"gap-2 md:gap-4"}
                    />

                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage={currentPage + 1}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>)}
                </CardContent>
            </Card>
        </div>
    );
}