"use client";
import { useEffect, useState } from "react";
import { extractIdFromSlug } from "@/utils/productSlug";
import { ProductGallery } from "@/app/product/[productSlug]/ProductComponents/ProductGallery";
import { ProductInfo } from "@/app/product/[productSlug]/ProductComponents/ProductInfo";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CommonHeader from "@/app/components/Header";
import {useProductWithCart} from "@/hooks/useProductWithCart";
import {RelatedProducts} from "@/app/product/[productSlug]/ProductComponents/RelatedProducts";

export default function ProductPage({ params }: { params: { productSlug: string } }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const productId = extractIdFromSlug(params.productSlug);
    const { product, error } = useProductWithCart(productId);

    useEffect(() => {
        setLoading(false);
    }, [product?.id]);

    if (loading) {
        return (
            <div className="container mx-auto p-4 mt-4">
                <Card className="rounded-none">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/2">
                                <Skeleton className="h-96 w-full" />
                                <div className="flex gap-2 mt-4">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-20 w-20" />
                                    ))}
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-4">
                                <Skeleton className="h-10 w-3/4" />
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-8 w-1/3" />
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
        <div className={""}>
            <CommonHeader categoryVisibility={"visible"} searchBarWidth={"64"}  isSearchAvailable={true}/>
            <div className="container mx-auto px-4 py-8 min-h-screen ">
                <Card className="rounded-none mt-24">
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
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <Card className="md:w-1/2 rounded-none shadow-sm">
                                <CardContent className="p-4">
                                    <ProductGallery images={product.detailImageUrls} />
                                </CardContent>
                            </Card>

                            <Card className="md:w-1/2 rounded-none shadow-sm ">
                                <CardContent className="p-8">
                                    <ProductInfo
                                        product={product}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {/* Related Products Section */}
                <Card className="mt-8 rounded-none">
                    <CardHeader className="px-6 py-4 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
                    </CardHeader>
                    <CardContent className="p-6">
                        <RelatedProducts/>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}