"use client";
import { motion } from "framer-motion";
import { LogIn, ShoppingCart } from "lucide-react";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 absolute top-0 left-0 w-full z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2"
      >
        <ShoppingCart className="text-beige-600" />
        <span className="font-bold text-xl text-gray-800 dark:text-white">
          ShopSmart
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden md:flex space-x-4"
      >
        <Link
          href="/"
          className="text-gray-600 dark:text-gray-300 hover:text-beige-600 dark:hover:text-beige-400"
        >
          Home
        </Link>
        <Link
          href="/"
          className="text-gray-600 dark:text-gray-300 hover:text-beige-600 dark:hover:text-beige-400"
        >
          Products
        </Link>
        <Link
          href="/"
          className="text-gray-600 dark:text-gray-300 hover:text-beige-600 dark:hover:text-beige-400"
        >
          About
        </Link>
        <Link
          href="/"
          className="text-gray-600 dark:text-gray-300 hover:text-beige-600 dark:hover:text-beige-400"
        >
          Contact
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-beige-600 dark:text-beige-400 font-semibold flex"
      >
        <LogIn size={20} className="mr-2" />
        Login
      </motion.div>
    </nav>
  );
};

export default NavBar;
