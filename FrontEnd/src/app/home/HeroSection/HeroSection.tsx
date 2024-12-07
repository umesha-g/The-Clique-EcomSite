"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ImageSlider from "./imageSlider";

const HeroSection: React.FC = () => {
  const bgcolors = ["bg-neutral-400", "bg-beige-300", "bg-neutral-300"];
  const textcolors = [
    "text-neutral-300 md:text-neutral-700 ",
    "text-beige-700 md:text-beige-800",
    "text-neutral-500 md:text-neutral-500 ",
  ];
  const [currentBgColor, setCurrentBgColor] = useState(0);
  const [currentTextColor, setCurrentTextColor] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgColor((prevColor) => (prevColor + 1) % bgcolors.length);
      setCurrentTextColor((prevColor) => (prevColor + 1) % textcolors.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bgcolors.length, textcolors.length]);

  return (
    <div
      className={`relative h-screen md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-[850px] overflow-hidden transition-all ${bgcolors[currentBgColor]} `}
    >
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ImageSlider />
      </motion.div>

      <div className={`absolute inset-0  flex items-center z-20 `}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`container mx-auto px-4 transition-all ${textcolors[currentTextColor]}`}
        >
          <div
            className={`p-6 md:border-2 relative w-[330px] md:w-fit top-36 bg-opacity-100 ${bgcolors[currentBgColor]} md:bg-transparent md:p-0 md:top-5`}
            //className="p-4 md:p-0 relative top-32 md:top-5"
          >
            <div className={"border-2 md:border-0 p-4"}>
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold mb-4 `}
              >
                Unleash Your <br className="block" /> Confidence
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6">
                Explore Fashion
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default HeroSection;
