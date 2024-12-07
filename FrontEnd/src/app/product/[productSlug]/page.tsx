import { extractIdFromSlug} from "@/utils/productSlug";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CommonHeader from "@/app/components/CommonHeader";
import {RelatedProducts} from "@/app/product/[productSlug]/ProductComponents/RelatedProducts";
import { getProduct} from "@/api/product-api";
import {ProductMain} from "@/app/product/[productSlug]/ProductComponents/productMain";
import CommonFooter from "@/app/components/CommonFooter";
import React from "react";

export default async function ProductPage({params}: { params: { productSlug: string }
}) {
    const productId = extractIdFromSlug(params.productSlug);
    const product = await getProduct(productId);

    if (!product) {
        return <div>Product not found</div>;
    }

    if(product) {
        return (
            <div>
                <CommonHeader categoryVisibility={"visible"} searchBarWidth={"64"} isSearchAvailable={true}/>
                <div className="container mx-auto px-4 py-8 min-h-screen ">
                    <Card className="rounded-none mt-20 md:mt-28">
                        <CardHeader className="px-6 py-4 border-b">
                            <nav className="flex text-sm text-gray-500 space-x-2">
                                <a href="/home" className="hover:text-gray-800">Home</a>
                                <span>/</span>
                                <a
                                    href={`/category/${product.category.id}`}
                                    className="hover:text-gray-800"
                                >
                                    {product.category.name}
                                </a>
                                <span>/</span>
                                <span className="text-gray-800">{product.name}</span>
                            </nav>
                        </CardHeader>
                        <CardContent className="p-4 md:p-8">
                            <ProductMain productId={product.id}/>
                        </CardContent>
                    </Card>

                    <Card className="mt-8 rounded-none">
                        <CardHeader className="px-6 py-4 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
                        </CardHeader>
                        <CardContent className="p-6">
                            <RelatedProducts productId={product.id}/>
                        </CardContent>
                    </Card>
                </div>
                <footer>
                    <CommonFooter height={"h-14"}/>
                </footer>
            </div>
        );
    }
}