import { FaStar } from "react-icons/fa";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductResponse } from "@/api/admin/admin-product-api";
import {useState} from "react";
import {motion} from "framer-motion";
import {addToCart} from "@/api/cart-api";
import {addToWishlist} from "@/api/wishlist-api";
import {Input} from "@/components/ui/input";
import {MiniDiscountResponse} from "@/api/discount-api";

interface ProductInfoProps {
    product: ProductResponse;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
                                                            product,
                                                        }) => {
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity,setQuantity] = useState(1)

    const activeDiscount = product.directDiscount ?
        product.directDiscount : product.otherDiscount;

    const discountedPrice = activeDiscount
        ? product.price * (1 - activeDiscount.discountPercentage / 100)
        : product.price;

    const handleAddToCart = async () => {
        if (!product) return;
        await addToCart({ productId: product.id, quantity: quantity, selectedColour: selectedColor, selectedSize: selectedSize});
    };

    const handleAddToWishlist = async () => {
        if (!product) return;
        await addToWishlist(product.id);
    };

    return (
        <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-5 h-5 ${
                                i < Math.floor(product.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            }`}
                        >
                            <FaStar />
                        </div>
                    ))}
                </div>
                <span className="ml-2 text-gray-600">
          ({product.purchaseCount} purchases)
        </span>
            </div>
            <p className="text-2xl flex flex-col  font-bold mb-4">
                <span>Rs. {discountedPrice.toFixed(2)}</span>
                    {activeDiscount && (
                        <span>
                            <span className={" text-gray-500 text-lg line-through"}>
                                Rs. {product.price.toFixed(2)}
                            </span>
                            <span className="ml-2 text-red-500 text-lg">
                                -{activeDiscount.discountPercentage}%
                            </span>
                        </span>
                    )}
            </p>

            {/* Color Options */}
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Color:</h3>
                <div className="flex space-x-6">
                    {product.colors.map((color) => (
                        <div>
                        <motion.button
                            key={color}
                            className={`w-8 h-8 rounded-full ${
                                selectedColor === color
                                    ? "ring-2 ring-offset-2 ring-gray-800"
                                    : ""
                            }`}
                            style={{ backgroundColor: color.slice(0,7) }}
                            onClick={() => setSelectedColor(color)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        />
                        <p className={"text-gray-500 text-sm text-center"}>{color.slice(8)}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={"flex space-x-3"}>
                {/* Size Selection */}
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Size:</h3>
                    <Select
                        value={selectedSize}
                        onValueChange={(value) => setSelectedSize(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                        <SelectContent>
                            {product.sizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Quantity Input */}
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Quantity:</h3>
                    <Input
                        type={"number"}
                        defaultValue={1}
                        onChange={(e)=>setQuantity(parseFloat(e.target.value))}
                    />
                </div>
            </div>

            <Button
                className="w-full mb-4 hover:bg-gray-600"
                onClick={handleAddToCart}
            >
                Add to Cart
            </Button>

            <Button
                variant="outline"
                className="w-full mb-4 hover:bg-gray-200"
                onClick={handleAddToWishlist}
            >
                Add to Wishlist
            </Button>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                    <AccordionTrigger>Details</AccordionTrigger>
                    <AccordionContent>{product.description}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                    <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                    <AccordionContent>
                        Free shipping on orders over $100. Easy returns within 30 days.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};