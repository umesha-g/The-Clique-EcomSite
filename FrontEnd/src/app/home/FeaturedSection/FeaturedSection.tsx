import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const FeaturedSection: React.FC = () => (
  <div className="container mx-auto px-4 pt-12 md:pb-12 overflow-hidden text-lg">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.a
        href="/category/button-up-shirts-e9627938-43b8-4b7c-95ac-a063bbc44d6b"
        whileHover={{ scale: 1.025 }}
        className="h-64 md:h-[260px] relative container overflow-hidden "
      >
        <div className="absolute z-10 p-4  justify-center items-center w-full h-full flex ">
          {/* transition-opacity ease-in-out bg-opacity-0 hover:bg-opacity-70 "> */}
          <h3 className="text-md  p-6 bg-white bg-opacity-80 text-gray-700">
            Button Up Shirts
          </h3>
        </div>

        <Image
          src="/assets/homePage/featured/featured-1.jpg"
          alt="Button up shirts"
          width={400}
          height={300}
          className="w-full h-64 md:h-auto md:-mt-16  xl:-mt-48 lg:-mt-28 object-cover"
          priority
        />
      </motion.a>

      <motion.a
        href="/category/printed-frocks-475e5eab-da33-49ab-a9f2-d03dbc9973b4"
        whileHover={{ scale: 1.025 }}
        className="h-64 md:h-[260px] relative container overflow-hidden"
      >
        <div className="absolute z-10 p-4  justify-center items-center w-full h-full flex ">
          {/* transition-opacity ease-in-out bg-opacity-0 hover:bg-opacity-70 "> */}
          <h3 className="text-md  p-6 bg-white bg-opacity-80 text-gray-700">
            Printed Frocks
          </h3>
        </div>

        <Image
          src="/assets/homePage/featured/featured-2.jpg"
          alt="Choose your first"
          width={400}
          height={300}
          className="w-full h-64 md:h-auto object-cover md:-mt-16  lg:-mt-48 xl:-mt-72"
          priority
        />
      </motion.a>

      <motion.a
        href="/deals"
        whileHover={{ scale: 1.025 }}
        className="bg-neutral-500 items-center justify-center flex h-64 md:h-[260px]"
      >
        <div className=" border-2 flex py-6 px-16 sm:py-14 sm:px-36 md:py-20 md:px-1 lg:py-16 lg:px-4 xl:py-10 xl:px-10 2xl:py-10 2xl:px-16 flex-col justify-center text-center text-white">
          <h3 className="text-2xl md:tex-xl lg:text-3xl mb-3 font-semibold">
            Daily Deals
          </h3>
          <p className="mb-4 font-light text-base sm:text-sm lg:text-lg">
            Up to 70% Off & Free Shipping
          </p>
        </div>
      </motion.a>
    </div>
  </div>
);

export default FeaturedSection;
