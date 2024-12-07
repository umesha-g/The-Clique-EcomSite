import ProductGrid from "@/app/components/ProductGrid";
import {getRelatedProduct, ProductCardResponse} from "@/api/product-api";

type relatedProductsProps = {
    productId: string;
}
export const RelatedProducts:React.FC<relatedProductsProps> = async ({productId}:relatedProductsProps) => {
    let products: ProductCardResponse[] = [];

    try {
        products = await getRelatedProduct(productId);
    } catch (error) {
        console.error("Error fetching Related Products:", error);
    }

    return (
        <div className="mt-4">
            <ProductGrid
                products={products}
                cols={"grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"}
                gap={"gap-2 md:gap-4"}
            />
        </div>
    );
};