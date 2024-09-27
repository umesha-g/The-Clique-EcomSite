"use client";
//import image1 from "#/assets/2151638350.jpg";
//import image2 from "#/assets/2151669741.jpg";
//import image3 from "#/assets/2151669788.jpg";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const images = [
  "../../../assets/2151638350.jpg",
  "../../../assets/2151669741.jpg",
  "../../../assets/2151669788.jpg",
  // Add more image paths as needed
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-600 to-purple-900">
      <nav className="p-4">
        <ul className="flex justify-between items-center text-white">
          <li className="font-bold">HOME</li>
          <li>ABOUT US</li>
          <li>PLACES</li>
          <li>CONTACT</li>
        </ul>
      </nav>

      <main className="container mx-auto px-4 flex flex-col md:flex-row items-center mt-10">
        <motion.div
          className="md:w-1/2 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-4">NEW COLLECTION</h1>
          <p className="mb-6">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          </p>
          <button className="bg-yellow-400 text-black px-6 py-2 rounded-full flex items-center">
            SIGN IN <FaArrowRight className="ml-2" />
          </button>
          <div className="flex mt-6 space-x-4">
            <FaInstagram size={24} />
            <FaTwitter size={24} />
            <FaFacebook size={24} />
          </div>
        </motion.div>

        <motion.div
          className="md:w-1/2 mt-10 md:mt-0 relative"
          animate={{ rotate: currentImage * 360 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            viewBox="0 0 200 200"
            className="absolute top-0 left-0 w-full h-full"
          >
            <motion.path
              d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              fill="none"
              strokeWidth="4"
              stroke="white"
              animate={{
                d: [
                  "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
                  "M 100, 100 m -50, -50 l 100,0 l 0,100 l -100,0 z",
                  "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
          <motion.img
            src={images[currentImage]}
            alt="Model"
            className="rounded-full w-1/2 h-auto object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </main>
    </div>
  );
}
