import { ProductCardResponse } from "@/api/product-api";
import ProductCard from "@/app/components/ProductCard";
import ProductGrid from "@/app/components/ProductGrid";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

interface SearchResultsProps {
    products: ProductCardResponse[];
    loading: boolean;
    searchTerm?: string;
}

export const SearchResults = ({ products, loading, searchTerm }: SearchResultsProps) => {
    return (
        <div className="">
            {searchTerm && (
                <h1 className="text-xl font-bold mb-4">
                    Search Results for "{searchTerm}"
                </h1>
            )}
            <ProductGrid products={products} loading={loading}/>
            {!loading && products.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No results found.</p>
                </div>
            )}
        </div>
    );
};