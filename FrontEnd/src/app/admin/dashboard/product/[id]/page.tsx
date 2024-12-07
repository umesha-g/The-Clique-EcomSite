"use client";
import React, {useEffect, useState} from 'react';
import { getProduct } from '@/api/product-api';
import ProductDetailHeader from './AdminProductComponents/ProductDetailHeader';
import ProductDetailImages from './AdminProductComponents/ProductDetailImages';
import ProductDetailInfo from './AdminProductComponents/ProductDetailInfo';
import StockAlert from './AdminProductComponents/StockAlert';
import ProductStatisticsDetails from "@/app/admin/dashboard/product/[id]/AdminProductComponents/ProductStatisticsDetails";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import { ProductResponse} from "@/api/admin/admin-product-api";
import {toast} from "@/hooks/use-toast";
import CommonHeader from "@/app/components/CommonHeader";
import {Button} from "@/components/ui/button";
import {IoMdArrowBack} from "react-icons/io";
import {useRouter} from "next/navigation";

export default function ProductDetailPage({params}: { params: { id: string } })
{
    const [product, setProduct] = useState<ProductResponse>();
    const id = params.id;
    const router = useRouter();
    const fetchProduct = async () => {
        try {
            const response = await getProduct(params.id);
            setProduct(response);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch products"+error,
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    if(product){
        return (
            <div>
                <CommonHeader categoryVisibility={"hidden"} isSearchAvailable={false} searchBarWidth={""}/>
                <Button className="relative 2xl:left-[15vw] left-[5vw] top-4 rounded-none cursor-pointer z-50" variant={"outline"} onClick={() => router.push(`/admin/dashboard/`)}> <IoMdArrowBack /> Back </Button>
                <div className="container mx-auto p-4">
                    <Card className={"rounded-none mt-24"}>
                        <CardHeader className={"flex flex-row items-center h-6 space-y-0 border-b"}>
                            <nav className="flex text-sm text-gray-500 space-x-2">
                                <a href="/admin/dashboard" className="hover:text-gray-800">Dashboard</a>
                                <span>/</span>
                                <span className="text-gray-500">Products</span>
                                <span>/</span>
                                <span className="text-gray-800">{product?.name}</span>
                            </nav>
                        </CardHeader>
                        <CardContent>
                            <StockAlert product={product} />
                            <ProductDetailHeader product={product}  fetchProduct={fetchProduct}/>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <ProductDetailImages product={product} />
                                <ProductDetailInfo product={product} />
                                <div className={"col-span-1 md:col-span-2"}>
                                    <ProductStatisticsDetails productId={id}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}