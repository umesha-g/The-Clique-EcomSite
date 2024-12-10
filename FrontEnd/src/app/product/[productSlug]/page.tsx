"use client";

import { useEffect, useState } from "react";
import { extractIdFromSlug } from "@/utils/productSlug";
import { ProductGallery } from "./ProductComponents/ProductGallery";
import { ProductInfo } from "./ProductComponents/ProductInfo";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CommonHeader from "@/app/components/CommonHeader";
import {useProductWithCart} from "@/hooks/useProductWithCart";
import { RelatedProducts } from "./ProductComponents/RelatedProducts";
import { getRelatedProduct, ProductCardResponse } from "@/api/product-api";
import CommonFooter from "@/app/components/CommonFooter";

export default function ProductPage({ params }: { params: { productSlug: string } }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const productId = extractIdFromSlug(params.productSlug);
    const { product, error } = useProductWithCart(productId);
    const [relatedProducts , setRelatedProducts] = useState<ProductCardResponse[]>([]);
    const [relatedLoading,setRelatedLoading] = useState(true);

    useEffect(() => {
        if (product) {
            setLoading(false);
        }
    }, [product]);

    useEffect(() => {
        const fetchproducts = async () =>{
            const response = await getRelatedProduct(product?.id);
            setRelatedProducts(response)
        }

        fetchproducts();
        setRelatedLoading(false);
    }, [product]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto p-4 mt-4">
                <Card className="rounded-none">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {error || "Product not found"}
                            </h1>
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div >
            <CommonHeader categoryVisibility={"visible"} searchBarWidth={"64"} isSearchAvailable={true}/>
            <div className="container mx-auto p-4 min-h-screen ">
                <Card className="rounded-none mt-28">
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
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <Card className="md:w-1/2 rounded-none mb-4">
                                <CardContent className="p-4">
                                    <ProductGallery images={product.detailImageUrls} />
                                </CardContent>
                            </Card>

                            <Card className="md:w-1/2 rounded-none ">
                                <CardContent className="p-4">
                                    <ProductInfo
                                        product={product}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {relatedProducts &&
                    <Card className="mt-8 rounded-none ">
                        <CardHeader className="px-6 py-4 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
                        </CardHeader>
                        <CardContent className="p-6">
                            <RelatedProducts products={relatedProducts} loading={relatedLoading}/>
                        </CardContent>
                    </Card> }
            </div>
            <CommonFooter height={"h-14"}/>
        </div>
    );
}