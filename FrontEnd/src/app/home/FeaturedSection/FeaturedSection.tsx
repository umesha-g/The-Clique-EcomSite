import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const FeaturedSection: React.FC = () => (
  <div className="container mx-auto px-4 pt-12 md:pb-12 overflow-hidden text-lg">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.a
        href="#"
        whileHover={{ scale: 1.025 }}
        className="h-64 md:h-[260px] relative container overflow-hidden "
      >
        <div className="absolute z-10 p-4  justify-center items-center w-full h-full flex ">
          {/* transition-opacity ease-in-out bg-opacity-0 hover:bg-opacity-70 "> */}
          <h3 className="text-md  p-6 bg-white bg-opacity-80 text-gray-700">
            Button up shirts
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
        href="#"
        whileHover={{ scale: 1.025 }}
        className="h-64 md:h-[260px] relative container overflow-hidden"
      >
        <div className="absolute z-10 p-4  justify-center items-center w-full h-full flex ">
          {/* transition-opacity ease-in-out bg-opacity-0 hover:bg-opacity-70 "> */}
          <h3 className="text-md  p-6 bg-white bg-opacity-80 text-gray-700">
            Printed Frock
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
        className="bg-neutral-500 items-center flex h-64 md:h-[260px]"
      >
        <div className=" mx-auto border-2 p-8 sm:p-14 md:p-2 xl:p-14 flex flex-col justify-center text-center text-white">
          <h3 className="text-2xl sm:text-lg md:tex-xl lg:text-3xl mb-3 font-semibold">
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
