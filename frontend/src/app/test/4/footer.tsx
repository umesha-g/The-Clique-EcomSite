"use client";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 py-4 text-center absolute bottom-0 left-0 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="flex justify-center space-x-4"
      >
        <a
          href="#"
          className="text-gray-400 hover:text-beige-600 dark:hover:text-beige-400"
        >
          <FaFacebook size={25} />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-beige-600 dark:hover:text-beige-400"
        >
          <FaTwitter size={25} />
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-beige-600 dark:hover:text-beige-400"
        >
          <FaInstagram size={25} />
        </a>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="text-gray-500 dark:text-gray-400 mt-4"
      >
        © 2024 The Clique. All rights reserved.
      </motion.p>
    </footer>
  );
};

export default Footer;
