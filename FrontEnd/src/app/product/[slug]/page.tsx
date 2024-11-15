"use client";

import { useEffect, useState } from "react";
import { ProductResponse } from "@/api/admin/admin-product-api";
import { getProduct } from "@/api/product-api";
import { extractIdFromSlug } from "@/utils/productSlug";
import { ProductGallery } from "../ProductComponents/ProductGallery";
import { ProductInfo } from "../ProductComponents/ProductInfo";
import { useRouter } from "next/navigation";

export default function ProductPage({ params }: { params: { slug: string } }) {
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productId = extractIdFromSlug(params.slug);
                const productData = await getProduct(productId);
                setProduct(productData);
            } catch (err) {
                setError("Failed to load product");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        {error || "Product not found"}
                    </h1>
                    <button
                        className="mt-4 text-gray-500 hover:underline"
                        onClick={() => router.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 bg-white text-gray-700">
            <div className="py-4 text-sm breadcrumbs">
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href={`/category/${product.category.id}`}>
                            {product.category.name}
                        </a>
                    </li>
                    <li>{product.name}</li>
                </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <ProductGallery images={product.detailImageUrls} />
                <ProductInfo
                    product={product}
                />
            </div>

            {/* Related Products section would go here */}
            {/* You'll need to implement an API endpoint to fetch related products */}
            {/* <RelatedProducts products={relatedProducts} /> */}
        </div>
    );
}