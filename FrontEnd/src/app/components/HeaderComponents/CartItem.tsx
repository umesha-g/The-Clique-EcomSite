import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {Minus, Plus, Trash2} from "lucide-react";
import React from "react";
import {CartItemResponse} from "@/api/cart-api";
import {prefix} from "@/utils/apiConfig";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {createProductSlug} from "@/utils/productSlug";

interface CartItemProps {
    item: CartItemResponse,
    onIncrease: () => Promise<void>,
    onDecrease: () => Promise<void>,
    onRemove: () => Promise<void>,
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {
    const productSlug = createProductSlug(item.product.name, item.product.id);
    const router = useRouter();

    return (
        <motion.div
            // initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full border hover:bg-neutral-100 transition-all p-2 mt-2"
        >
            <div className="flex gap-4">
                <div className="w-24 h-24 bg-neutral-100 rounded-none border overflow-hidden cursor-pointer"
                     onClick={() => router.push(`/product/${productSlug}`)}
                >
                    <Image
                        src={prefix + item.product.cardImageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                    />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className={"max-w-40 overflow-hidden"}>
                            <h3 className="font-semibold text-base ">{item.product.name}</h3>
                            <p className=" text-xs text-neutral-500 mt-1">
                                Size: {item.selectedSize} | Color: {item.selectedColour.slice(8)}
                            </p>
                        </div>
                        <div className="flex items-center border border-neutral-200 rounded-none">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-none"
                                onClick={onDecrease}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-none"
                                onClick={onIncrease}
                                disabled={0 == item.product.stock}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <div className="mt-1 flex items-center space-x-2  justify-between">
                            <span className={`text-base`}>
                              Rs.{(item.subTotal).toFixed(2)}
                            </span>
                        </div>
                        <Button
                            variant="destructive"
                            className="h-10 w-10 p-0 rounded-none"
                            onClick={onRemove}
                        >
                            <Trash2 className={"text-3xl"} />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;