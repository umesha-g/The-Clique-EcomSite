import ToggleThemeButton from "@/app/commonComponents/toggleThemeButton";
import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center"></div>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <Link
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Products
            </Link>
            <Link
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              About
            </Link>
            <Link
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ToggleThemeButton />
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <ShoppingCart size={20} />
            </button>

            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
