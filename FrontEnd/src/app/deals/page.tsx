"use client";
import React, { useEffect, useState } from "react";
import {ProductCardResponse, getProductsByDiscountRange} from "@/api/product-api";
import ProductGrid from "@/app/components/ProductGrid";
import { Pagination } from "@/app/components/PaginationComponent";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import CommonHeader from "@/app/components/CommonHeader";
import {ProductSortSelector} from "@/app/deals/dealsComponents/sortSelector";
import CommonFooter from "@/app/components/CommonFooter";

export default function CategoryMain() {
    const [products, setProducts] = useState<ProductCardResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [currentSort, setCurrentSort] = useState("createdAt,desc")
    const pageSize = 30;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProductsByDiscountRange({
                    minDirectDiscount: 20,
                    maxDirectDiscount: 70,
                    minOtherDiscount: 20,
                    maxOtherDiscount: 70,
                    page: 0,
                    size: pageSize,
                    sortBy: currentSort
                });
                setProducts(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage,]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSortChange = (sortValue: string) => {
        setCurrentSort(sortValue)
        setCurrentPage(0)
    }

    return (
        <div>
            <CommonHeader
                categoryVisibility={"visible"}
                searchBarWidth={"64"}
                isSearchAvailable={true}
            />
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
                                    Deals
                                </span>
                            </nav>
                        </div>

                    </CardHeader>
                    <CardContent className={"p-2"}>
                        <div className={"flex justify-between"}>
                            <div>
                                <CardTitle className={"mt-4"}>Deals</CardTitle>
                                <CardDescription>Up to 70% Off</CardDescription>
                                <p className="text-gray-600 mt-8">
                                    Showing {products.length} of {totalElements} products
                                </p>
                            </div>
                            <ProductSortSelector
                                onSortChange={handleSortChange}
                                currentSort={currentSort}
                            />
                        </div>
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
            <footer>
                <CommonFooter height={"h-14"}/>
            </footer>
        </div>
    );
}