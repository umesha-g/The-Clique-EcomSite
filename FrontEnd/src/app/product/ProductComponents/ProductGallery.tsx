import { motion } from "framer-motion";
import React, { useState } from "react";
import { prefix } from "@/utils/apiConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface ProductGalleryProps {
    images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="w-full space-y-4">
            {/* Main Image */}
            <motion.div
                className="relative w-full aspect-square bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Image
                    src={`${prefix + selectedImage}`}
                    alt="Selected product view"
                    className="object-cover object-center"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </motion.div>

            {/* Thumbnail Scroll Area */}
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            className={`relative shrink-0 cursor-pointer 
                                ${selectedImage === img
                                ? 'ring-2 ring-black ring-offset-2'
                                : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1'
                            }`}
                            onClick={() => setSelectedImage(img)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="w-20 aspect-square relative">
                                <Image
                                    src={`${prefix + img}`}
                                    alt={`Product view ${index + 1}`}
                                    className="object-cover object-center"
                                    fill
                                    sizes="80px"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};