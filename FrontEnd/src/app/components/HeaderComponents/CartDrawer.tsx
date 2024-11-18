import React from "react";
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

const CartDrawer = () => {
    const { cartItems, cartItemCount, totalPrice, refreshCart } = useCart();

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

    const EmptyCart = () => (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="font-medium text-lg mb-2">Your Cart is Empty</h3>
            <p className="text-sm text-neutral-500">Add items to start shopping</p>
        </div>
    );

    return (
        <Sheet>
            <SheetTrigger className="relative">
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                        {cartItemCount}
                    </span>
                )}
                <ShoppingCart className="w-5 h-5 text-neutral-700 hover:text-neutral-950 hover:fill-neutral-950 transition-all ease-in-out" />
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-lg rounded-none">
                <SheetHeader className="border-b pb-4 px-6 -mx-6">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Shopping Cart
                    </SheetTitle>
                </SheetHeader>

                {cartItems.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <>
                        <ScrollArea className="flex-1 px-6 -mx-6 h-[75vh]">
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

                        <div className="border-t mt-auto px-6 -mx-6 pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-neutral-500">Subtotal</span>
                                <span className="font-medium">${totalPrice.toFixed(2)}</span>
                            </div>
                            <Button className="w-full rounded-none" size="lg">
                                Proceed to Checkout
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;