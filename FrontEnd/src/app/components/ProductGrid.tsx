import {ProductCardResponse} from "@/api/product-api";
import ProductCard from "@/app/components/ProductCard";

interface ProductGridProps {
    products: ProductCardResponse[];
    loading: boolean;
}

const ProductGrid = ({ products, loading }: ProductGridProps) => {
    return (
        <div className="w-full">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
            ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="w-full flex justify-center">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGrid;