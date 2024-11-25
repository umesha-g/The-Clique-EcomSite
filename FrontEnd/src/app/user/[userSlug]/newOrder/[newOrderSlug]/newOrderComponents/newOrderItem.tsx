import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {Minus, Plus, Trash2} from 'lucide-react';
import { prefix } from "@/utils/apiConfig";
import { calculateDiscountedPrice } from "@/utils/DIscountCalculator";

interface CartItemProps {
    cartItem: {
        product: {
            id: string;
            name: string;
            cardImageUrl: string;
            stock: number;
        };
        selectedSize: string;
        selectedColour: string;
        quantity: number;
    };
    onDecrease: (itemId: string, color: string, size: string) => void;
    onIncrease: (itemId: string, color: string, size: string) => void;
    onRemove: (itemId: string, color: string, size: string) => void;
}

export const NewOrderItem: React.FC<CartItemProps> = ({
                                                      cartItem,
                                                      onDecrease,
                                                      onIncrease,
                                                      onRemove
                                                  }) => {
    const discountedPrice = calculateDiscountedPrice(cartItem.product);

    return (
        <div className={"flex py-1 px-1 items-center space-x-0 sm:space-x-4 border"}>
            <div className = {"flex-col flex sm:flex-row sm:justify-between w-full"}>
                <div className={"flex items-center"}>
                    <Image
                        src={prefix + cartItem.product.cardImageUrl}
                        alt={cartItem.product.name}
                        className="w-24 sm:w-28 h-24 sm:h-28 object-cover border sm:mb-0"
                        width={100}
                        height={100}
                    />
                    <div className="flex flex-col ml-4 sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base">
                                {cartItem.product.name}
                            </h3>
                            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                                Size: {cartItem.selectedSize}
                                <span className="flex items-center mt-1">
                                    Color:
                                    <div
                                        style={{
                                            backgroundColor: cartItem.selectedColour.slice(0, 7)
                                        }}
                                        className="rounded-full ml-2 border-2 border-neutral-300 p-2 h-4 w-4"
                                    />
                                    <span className="ml-2 text-xs">
                                        {cartItem.selectedColour.slice(8)}
                                    </span>
                                </span>
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="font-bold text-sm sm:text-base">
                                Rs.{discountedPrice.toFixed(2)}
                            </p>
                        </div>
                        </div>
                    </div>
                </div>

                <div className={"flex items-center justify-between sm:space-x-6 sm:mr-6"}>
                    <div className={"flex items-center w-24 justify-between border border-neutral-200 dark:border-neutral-700 rounded-none"}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-none"
                            onClick={() => onDecrease(
                                cartItem.product.id,
                                cartItem.selectedColour,
                                cartItem.selectedSize
                            )}
                            disabled={cartItem.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className={`w-4 text-center`}>{cartItem.quantity}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-none"
                            onClick={() => onIncrease(
                                cartItem.product.id,
                                cartItem.selectedColour,
                                cartItem.selectedSize
                            )}
                            disabled={cartItem.quantity >= cartItem.product.stock}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(
                            cartItem.product.id,
                            cartItem.selectedColour,
                            cartItem.selectedSize
                        )}
                        className="rounded-none w-10 h-10 "
                    >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};