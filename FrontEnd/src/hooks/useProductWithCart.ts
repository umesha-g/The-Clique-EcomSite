"use client";

import { useState, useEffect } from 'react';
import { ProductResponse } from "@/api/admin/admin-product-api";
import { getProduct } from "@/api/product-api";
import { useCart } from "@/contexts/cartContext";

export function useProductWithCart(productId: string) {
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { cartItems } = useCart();

    const fetchProduct = async () => {
        try {
            const productData = await getProduct(productId);
            setProduct(productData);
        } catch (err) {
            setError("Failed to load product");
            console.error(err);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [productId, cartItems]);

    return { product, error, fetchProduct };
}