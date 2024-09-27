"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => {
  return (
    <main className="container mx-auto px-4 py-20 md:pb-16 md:pt-32 ">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:w-1/3 mb-8 lg:mb-0 z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            New Arrivals
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-beige-600 dark:text-beige-400 mb-6">
            Just For
          </h2>
          <h2 className="text-3xl md:text-5xl font-bold text-beige-600 dark:text-beige-400 mb-6">
            You
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Discover our latest collection and enjoy exclusive online discounts.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-beige-600 dark:bg-beige-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-beige-700 dark:hover:bg-beige-600 transition duration-300"
          >
            Shop Now
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:w-[22%] flex justify-center"
        >
          <Image
            src="/assets/Hero.png"
            alt="Fashion model"
            width={150}
            height={450}
            priority={true}
            layout="responsive"
            objectFit="contain"
            className="w-full h-auto z-20"
          />
          <div className="absolute w-64 h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 z-0 md:mt-20 bg-beige-100 dark:bg-gray-800 rounded-full overflow-hidden"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="lg:w-1/3 mt-8 lg:mt-0 text-center lg:text-right z-10"
        >
          <h3 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Online Order Special
          </h3>
          <p className="text-5xl md:text-7xl font-extrabold text-beige-600 dark:text-beige-400 mb-4">
            30% OFF
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Limited time offer. Don t miss out!
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default HeroSection;
