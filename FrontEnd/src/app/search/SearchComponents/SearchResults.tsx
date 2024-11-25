"use client";
import { ProductCardResponse } from "@/api/product-api";
import ProductGrid from "@/app/components/ProductGrid";

interface SearchResultsProps {
    products: ProductCardResponse[];
    loading: boolean;
    searchTerm?: string;
}

export const SearchResults = ({ products, loading, searchTerm }: SearchResultsProps) => {
    return (
        <div >
            {searchTerm && (
                <h1 className="text-xl font-bold mb-4">
                    Search Results for <span className={"text-neutral-700"}>{searchTerm}</span>
                </h1>
            )}
            {!loading && products.length > 0 && (
                <span className={"text-neutral-700 text-sm"}>{products.length} Results</span>
                )}
            <ProductGrid
                products={products}
                loading={loading}
                cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5"
                gap="gap-2 md:gap-4"
            />
            {!loading && products.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No results found.</p>
                </div>
            )}
        </div>
    );
};