import {ProductCardResponse} from "@/api/product-api";
import ProductCard from "@/app/components/ProductCard";

interface ProductGridProps {
    products: ProductCardResponse[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    return (
        <div className={"mx-auto w-[1200px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;