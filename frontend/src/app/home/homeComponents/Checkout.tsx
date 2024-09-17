// homeComponents/Checkout.tsx
import React from "react";

interface CheckoutProps {
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white text-black p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <p>Proceeding to payment gateway...</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Checkout;
