// homeComponents/Cart.tsx
import React from "react";
import { Product } from "./types";

interface CartProps {
  cart: { [key: number]: number };
  products: Product[];
  onClose: () => void;
  onCheckout: () => void;
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
  getTotalPrice: () => number;
}

const Cart: React.FC<CartProps> = ({
  cart,
  products,
  onClose,
  onCheckout,
  onAddToCart,
  onRemoveFromCart,
  getTotalPrice,
}) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center bg-gray-800 text-white">
      <div className="container relative bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        <ul>
          {Object.keys(cart).map((productId) => {
            const product = products.find((p) => p.id === String(productId));
            return (
              <li
                key={productId}
                className="flex justify-between items-center mb-2"
              >
                <span>{product?.name}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRemoveFromCart(String(productId))}
                    className="bg-red-600 px-2 py-1 rounded-lg"
                  >
                    -
                  </button>
                  <span>{cart[Number(productId)]}</span>
                  <button
                    onClick={() => onAddToCart(String(productId))}
                    className="bg-green-600 px-2 py-1 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold">
            Total: {getTotalPrice()} USD
          </span>
          <button
            onClick={onCheckout}
            className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500"
          >
            Checkout
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Cart;
