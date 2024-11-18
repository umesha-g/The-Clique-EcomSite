import {motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {MdDeleteOutline} from "react-icons/md";
import {Minus, Plus} from "lucide-react";
import React from "react";
import {CartItemResponse} from "@/api/cart-api";
import {prefix} from "@/utils/apiConfig";

interface CartItemProps {
    item: CartItemResponse,
    onIncrease: () => Promise<void>,
    onDecrease: () => Promise<void>,
    onRemove: () => Promise<void>,
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {
    const activeDiscount = item.product.directDiscount
        ? item.product.directDiscount
        : item.product.otherDiscount;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full border-b border-neutral-200 dark:border-neutral-700 py-4"
        >
            <div className="flex gap-4">
                <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-none overflow-hidden">
                    <img
                        src={prefix + item.product.cardImageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-base">{item.product.name}</h3>
                            <p className=" text-sm text-neutral-500 mt-1">
                                Size: {item.selectedSize} | Color: {item.selectedColour.slice(8)}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            className="h-10 w-10 p-0 rounded-none"
                            onClick={onRemove}
                        >
                            <MdDeleteOutline className={"text-2xl"} />
                        </Button>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-none">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-none"
                                onClick={onDecrease}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-none"
                                onClick={onIncrease}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>

                        <div className="mt-1 flex items-center space-x-2  justify-between">
                            <span className={`${activeDiscount ? "text-red-500" : "text-black" } text-base sm:text-lg font-semibold`}>
                              Rs.{(item.subTotal).toFixed(2)}
                            </span>
                            {activeDiscount && (
                                <div className=" text-sm sm:text-base">
                                    <span className="line-through text-gray-400">
                                        Rs.{(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;