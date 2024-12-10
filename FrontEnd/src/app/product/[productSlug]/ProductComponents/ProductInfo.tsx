"use client";
import { FaStar } from "react-icons/fa";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductResponse } from "@/api/admin/admin-product-api";
import React, {useEffect, useState} from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import AddToCartButton from "@/app/components/addToCartButton";
import ProductWishlistButton from "@/app/product/[productSlug]/ProductComponents/ProductWishlistButton";
import {ActiveDiscount, calculateDiscountedPrice} from "@/utils/DIscountCalculator";
import {BrandResponse} from "@/api/admin/admin-brand-api";
import {getBrandById} from "@/api/brand-api";
import {prefix} from "@/utils/apiConfig";
import Image from "next/image";

interface ProductInfoProps {
    product: ProductResponse;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const[brand,setBrand] = useState<BrandResponse | null>(null)

    useEffect(() => {
        const fetchCategory = async () => {
            if(product.brand){
                try {
                    const response = await getBrandById(product.brand.id);
                    setBrand(response);
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }
            } else{
                setBrand(null);
            }
        };

        fetchCategory();
    }, []);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className={"flex-col space-x-4 justify-start"}>
                    {brand &&
                        <div className={"flex space-x-2 mb-4 border items-center w-full sm:w-fit py-1 px-2"} >
                            <Image
                                src={`${prefix + brand.logoUrl}`}
                                alt="brand logo"
                                className="object-cover object-center"
                                width={80}
                                height={80}
                            />
                            <div className={"flex-col"}>
                                <p className={"text-sm font-semibold"}>
                                    {brand.name}
                                </p>
                                <p className={"text-xs text-neutral-600"}>
                                    {brand.description}
                                </p>
                            </div>
                        </div>
                    }
                    <div className={"grid grid-cols-4 space-x-4 items-center"}>
                        <h1 className="text-2xl col-span-3 font-bold text-gray-900">{product.name}</h1>
                        {(product.stock > 0) ?
                            (<p className={`bg-green-600 text-balance text-white w-32 text-center py-1 px-3 rounded-full`}>{product.stock} In Stock</p>)
                            : (<p className={`bg-red-600 text-balance text-white w-32 text-center py-1 px-3 rounded-full`}>Out Of Stock</p>)
                        }
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={`w-5 h-5 ${
                                    i < Math.floor(product.rating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500">
                        ({product.purchaseCount} purchases)
                    </span>
                </div>
            </div>

            <Card className="rounded-none bg-gray-50">
                <CardContent className="p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row items-baseline space-x-4">
                        <span className="text-2xl font-bold text-gray-900">
                            Rs. {calculateDiscountedPrice(product).toFixed(2)}
                        </span>
                        {(product.directDiscount || product.otherDiscount) && <div className="space-x-2">
                                <span className="text-lg text-gray-500 line-through">
                                    Rs. {product.price.toFixed(2)}
                                </span>
                                <span className="text-lg font-semibold text-red-500">
                                    {ActiveDiscount(product)?.discountPercentage}% OFF
                                </span>
                            </div>}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Color:</h3>
                <div className="flex flex-wrap gap-4">
                    {product.colors.map((color) => (
                        <div className={"flex-col flex items-center space-y-2"} key={color}>
                                <motion.button
                                    className={`w-10 h-10 rounded-full ${
                                        selectedColor === color
                                            ? "ring-2 ring-offset-2 ring-black"
                                            : "ring-1 ring-offset-1 ring-gray-300"
                                    }`}
                                    style={{ backgroundColor: color.slice(0, 7) }}
                                    onClick={() => setSelectedColor(color)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                                <p>{color.slice(8)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Size:</h3>
                    <Select
                        value={selectedSize}
                        onValueChange={(value) => setSelectedSize(value)}
                    >
                        <SelectTrigger className="w-full rounded-none">
                            <SelectValue className={"rounded-none"} placeholder="Select a size" />
                        </SelectTrigger>
                        <SelectContent className={"rounded-none"}>
                            {product.sizes.map((size) => (
                                <SelectItem className={"rounded-none"} key={size} value={size}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Quantity:</h3>
                    <Input
                        type="number"
                        min="1"
                        max={product.stock}
                        inputMode={"numeric"}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className={"w-full rounded-none"}
                    />
                </div>
            </div>

            <div className="space-y-3 lg:space-y-0 flex-col lg:space-x-3 flex lg:flex-row">
                <div className={"w-full h-12 text-lg rounded-none"}>
                    <ProductWishlistButton productId={product.id}/>
                </div>
                <AddToCartButton
                    product={product}
                    quantity={quantity}
                    selectedColour={selectedColor}
                    selectedSize={selectedSize}
                />
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border-t border-b">
                    <AccordionTrigger className="text-lg font-semibold">
                        Product Details
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        {product.description}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping" className="border-b">
                    <AccordionTrigger className="text-lg font-semibold">
                        Shipping & Returns
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                        Free shipping on orders over $100. Easy returns within 30 days.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};