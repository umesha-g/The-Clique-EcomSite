"use client";
import { ProductGallery } from "@/app/product/[productSlug]/ProductComponents/ProductGallery";
import { ProductInfo } from "@/app/product/[productSlug]/ProductComponents/ProductInfo";
import { Card, CardContent } from "@/components/ui/card";
import {useProductWithCart} from "@/hooks/useProductWithCart";

interface ProductMainProps{
    productId: string;
}

export const ProductMain:React.FC<ProductMainProps> =({ productId }) => {
    const { product,error} = useProductWithCart(productId);

    if (error){
        return (
            <div className={"flex justify-center items-center h-64"}>
                <h1 className={"text-xl"}>Error Loading Product</h1>
            </div>
        )
    }

    if(product) {
        return (
            <div className="flex flex-col md:flex-row gap-8">
                <Card className="md:w-1/2 rounded-none">
                    <CardContent className="p-4">
                        <ProductGallery images={product.detailImageUrls}/>
                    </CardContent>
                </Card>

                <Card className="md:w-1/2 rounded-none">
                    <CardContent className="p-8">
                        <ProductInfo
                            product={product}
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    else {
        return (
            <div className={"flex justify-center items-center h-64"}>
                <div className={"animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"} />
            </div>
        )
    }
}