"use client";
import ProductGrid from "@/app/components/ProductGrid";
import { ProductCardResponse} from "@/api/product-api";

type relatedProductsProps = {
    products: ProductCardResponse[];
    loading : boolean;
}
export const RelatedProducts:React.FC<relatedProductsProps> = ({products , loading}) => {

    if(loading){
        return(
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        )
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