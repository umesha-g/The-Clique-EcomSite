"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { prefix } from "@/utils/apiConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface ProductGalleryProps {
    images: string[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && selectedImageIndex < images.length - 1) {
            setSelectedImageIndex(prev => prev + 1);
        } else if (isRightSwipe && selectedImageIndex > 0) {
            setSelectedImageIndex(prev => prev - 1);
        }

        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <div className="w-full space-y-4">
            <motion.div
                className="relative w-full aspect-square border p-6 bg-gray-100 overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <AnimatePresence>
                    <motion.div
                        key={selectedImageIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={`${prefix + images[selectedImageIndex]}`}
                            alt={`Selected product view ${selectedImageIndex + 1}`}
                            className="object-cover object-center"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="grid grid-flow-col md:grid-cols-3 md:grid-rows-2 xl:grid-rows-1 xl:grid-cols-6 gap-2 p-2">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            className={`relative border cursor-pointer 
                                ${selectedImageIndex === index
                                ? 'ring-2 ring-black ring-offset-1'
                                : 'hover:ring-1 hover:ring-gray-300'
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="aspect-square relative">
                                <Image
                                    src={`${prefix + img}`}
                                    alt={`Product view ${index + 1}`}
                                    className="object-cover object-center"
                                    fill
                                    sizes="100px"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};