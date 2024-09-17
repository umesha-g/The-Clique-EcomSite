"use client";
import { Button } from "@/components/ui/button"; // Make sure to import the Button component correctly from ShadCN
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const HeroSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20 pb-12 md:pt-32 md:pb-20"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 ml-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Come to join us!
            </h1>
            <p className="text-lg mb-6">
              From year to year we strive to invent the most innovative
              technology that is used by both small enterprises and space
              enterprises.
            </p>
            {/* ShadCN Button Component */}
            <Button variant="default" className="mb-4">
              See current job openings
            </Button>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/path/to/image.jpg" // Make sure to replace this with a valid image path
              alt="Team working together"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
