import { ProductCardResponse } from "@/api/product-api";
import ProductCard from "@/app/components/ProductCard";

interface ProductGridProps {
    products: ProductCardResponse[];
    loading?: boolean;
    cols?: string;
    gap?: string;
    className?: string;
}

const ProductGrid = ({
                         products,
                         loading = false,
                         cols = "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4",
                         gap = "gap-2 sm:gap-4",
                         className = ""
                     }: ProductGridProps) => {
    return (
        <div className={`w-full mt-4 ${className}`}>
            {loading ? (
                <div className={"flex justify-center items-center h-64"}>
                    <div className={"animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"} />
                </div>
            ) : (
                <div className={`grid ${cols} ${gap}`}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGrid;