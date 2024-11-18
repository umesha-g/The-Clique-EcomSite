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
import { useState } from "react";
import { motion } from "framer-motion";
import { addToWishlist } from "@/api/wishlist-api";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import AddToCartButton from "@/app/components/addToCartButton";
import ProductWishlistButton from "@/app/product/ProductComponents/ProductWishlistButton";

interface ProductInfoProps {
    product: ProductResponse;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);

    const activeDiscount = product.directDiscount
        ? product.directDiscount
        : product.otherDiscount;

    const discountedPrice = activeDiscount
        ? product.price * (1 - activeDiscount.discountPercentage / 100)
        : product.price;

    return (
        <div className="space-y-6">
            {/* Product Title and Rating */}
            <div className="space-y-4">
                <div className={"flex space-x-4 content-center"}>
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    {(product.stock > 0) ?
                        (<p className={`bg-green-600  text-white  py-1 px-3 rounded-full`}>{product.stock} In Stock</p>)
                        : (<p className={`bg-red-600  text-white  py-1 px-3 rounded-full`}>Out Of Stock</p>)
                    }
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
                    <div className="flex items-baseline space-x-4">
                        <span className="text-3xl font-bold text-gray-900">
                            Rs. {discountedPrice.toFixed(2)}
                        </span>
                        {activeDiscount && (
                            <div className="space-x-2">
                                <span className="text-lg text-gray-500 line-through">
                                    Rs. {product.price.toFixed(2)}
                                </span>
                                <span className="text-lg font-semibold text-red-500">
                                    -{activeDiscount.discountPercentage}%
                                </span>
                            </div>
                        )}
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

            {/* Action Buttons */}
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