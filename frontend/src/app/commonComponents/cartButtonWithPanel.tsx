import { useTriggerContext } from "@/contexts/triggerContext";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  seller: User;
  imageUrl: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

const CartButtonWithPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { setTriggerFunction } = useTriggerContext();

  useEffect(() => {
    setTriggerFunction(() => fetchCartItems());
  }, [setTriggerFunction]);

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/cart", {
        withCredentials: true,
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${itemId}`, {
        withCredentials: true,
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.button
        className="fixed right-4 bottom-4 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ShoppingCart size={24} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cartItemCount}
          </span>
        )}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold dark:text-white">
                  Your Cart
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <X size={24} />
                </button>
              </div>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-between items-center mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded"
                >
                  <div>
                    <p className="font-semibold dark:text-white">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="mr-4 dark:text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
              <div className="mt-8">
                <p className="text-xl font-bold dark:text-white">
                  Total: ${totalPrice.toFixed(2)}
                </p>
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Checkout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartButtonWithPanel;
