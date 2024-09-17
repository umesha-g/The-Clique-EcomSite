// homeComponents/Header.tsx
import React from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { User } from "./types";

interface HeaderProps {
  user: User | null;
  cartItemCount: number;
  onCartClick: () => void;
  onSearch: (term: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  cartItemCount,
  onCartClick,
  onSearch,
  onLogout,
}) => {
  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Our Store</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => onSearch(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <button onClick={onCartClick} className="relative">
            <FaShoppingCart className="text-2xl text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white">
                {cartItemCount}
              </span>
            )}
          </button>
          {user && (
            <div className="text-sm text-white">
              Welcome, {user.fullName}
              <button
                onClick={onLogout}
                className="ml-2 text-red-500 hover:text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
