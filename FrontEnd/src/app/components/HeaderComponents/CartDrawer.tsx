"use client";
import React, {useEffect, useState} from "react";
import { ShoppingCart } from "lucide-react";
import {AnimatePresence} from "framer-motion";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cartContext";
import { decrementQuantity, incrementQuantity, removeFromCart } from "@/api/cart-api";
import CartItem from "@/app/components/HeaderComponents/CartItem";
import {useRouter} from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import {createUserSlug} from "@/utils/userSlug";
import {useAuth} from "@/contexts/authContext";

const CartDrawer = () => {
    const { cartItems, cartItemCount, totalPrice, refreshCart } = useCart();
    const router = useRouter();
    const { user } = useAuth();
    const[userSlug,setUserSlug]=useState<string|null>(null);

    useEffect(() => {
        if(user){
            setUserSlug(createUserSlug(user.id, user.firstName))
        }
    }, [user]);

    const handleRemove = async (itemId: string, color: string, size: string) => {
        try {
            await removeFromCart(itemId, color, size);
            await refreshCart();
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const handleIncrease = async (itemId: string, color: string, size: string) => {
        try {
            // Pass all necessary parameters to identify the specific item
            await incrementQuantity(itemId, color, size);
            await refreshCart();
        } catch (error) {
            console.error("Error increasing cart item quantity:", error);
        }
    };

    const handleDecrease = async (itemId: string, color: string, size: string) => {
        try {
            // Pass all necessary parameters to identify the specific item
            await decrementQuantity(itemId, color, size);
            await refreshCart();
        } catch (error) {
            console.error("Error decreasing cart item quantity:", error);
        }
    };

    const handleProceedToCheckout = () => {
        const newOrderSlug = uuidv4();
        router.push(`/user/${userSlug}/newOrder/${newOrderSlug}`);
    };

    return (
        <Sheet>
            <SheetTrigger className="relative">
                {cartItemCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {cartItemCount}
                    </span>
                )}
                <ShoppingCart className="w-5 h-5 text-neutral-700 hover:text-neutral-950 hover:fill-neutral-950 transition-all ease-in-out" />
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md rounded-none">
                <SheetHeader className="border-b pb-4 px-6 -mx-6">
                    <SheetTitle className="flex items-center gap-2">
                        {/*<ShoppingCart className="w-5 h-5" />*/}
                        Shopping Cart
                    </SheetTitle>
                </SheetHeader>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">Your Cart is Empty</h3>
                        <p className="text-sm text-neutral-500">Add items to start shopping</p>
                    </div>
                ) : (
                    <div>
                        <ScrollArea className={"flex-col flex mt-2 h-[65vh]"}>
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={`${item.product.id}-${item.selectedColour}-${item.selectedSize}`}
                                        item={item}
                                        onIncrease={() => handleIncrease(item.product.id, item.selectedColour, item.selectedSize)}
                                        onDecrease={() => handleDecrease(item.product.id, item.selectedColour, item.selectedSize)}
                                        onRemove={() => handleRemove(item.product.id, item.selectedColour, item.selectedSize)}
                                    />
                                ))}
                            </AnimatePresence>
                        </ScrollArea>

                        <div className="border-t mt-auto  pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-neutral-500">Subtotal</span>
                                <span className="font-medium">Rs.{totalPrice.toFixed(2)}</span>
                            </div>
                            <Button onClick={()=> handleProceedToCheckout()} className="w-full rounded-none" size="lg">
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;