import { motion } from "framer-motion";
import React, { useState } from "react";
import {prefix} from "@/utils/apiConfig";

interface ProductGalleryProps {
    images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="md:w-1/2">
            <div className="flex">
                <div className="w-1/5 space-y-4">
                    {images.map((img, index) => (
                        <motion.img
                            key={index}
                            src={prefix + img}
                            alt={`Product view ${index + 1}`}
                            className={`w-full cursor-pointer rounded-lg ${
                                selectedImage === img ? 'ring-2 ring-black' : ''
                            }`}
                            onClick={() => setSelectedImage(img)}
                            whileHover={{ scale: 1.05 }}
                        />
                    ))}
                </div>
                <motion.div
                    className="w-4/5 ml-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <img
                        src={prefix + selectedImage}
                        alt="Selected product view"
                        className="w-full rounded-lg"
                    />
                </motion.div>
            </div>
        </div>
    );
};