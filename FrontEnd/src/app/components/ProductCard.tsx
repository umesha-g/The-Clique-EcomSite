"use client";

import { motion } from "framer-motion";
import AddToCartButton from "./addToCartButton";
import WishlistHeartButton from "./wishlistHeartButton";
import {prefix} from "@/utils/apiConfig";
import {ProductCardResponse} from "@/api/product-api";
import {createProductSlug} from "@/utils/productSlug";
import {FaStar} from "react-icons/fa";
import {useRouter} from "next/navigation";

interface ProductCardProps {
  product: ProductCardResponse;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const productSlug = createProductSlug(product.name, product.id);

  const activeDiscount = product.directDiscount
      ? product.directDiscount
      : product.otherDiscount;

  const discountedPrice = activeDiscount
      ? product.price * (1 - activeDiscount.discountPercentage / 100)
      : product.price;

  return (
      <motion.div
          variants={containerVariants}
          className="w-full max-w-[280px] h-auto"
          initial="hidden"
          animate="visible"
      >
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-none border p-3 sm:p-4 w-full flex-none"
        >
          <WishlistHeartButton productId={product.id}  className={"absolute z-10 top-4 right-4"}/>
          <div onClick={() => router.push(`/product/${productSlug}`)} className="cursor-pointer">
            <div className="relative border-b w-full aspect-square">
              <img
                  src={prefix + product.cardImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-none"
              />
            </div>

            <h3 className="my-2 text-sm sm:text-base line-clamp-2">{product.name}</h3>

            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
              ({product.purchaseCount})
            </span>
            </div>

            <div className="mt-1 flex items-center justify-between">
            <span className="text-red-500 text-base sm:text-lg font-semibold">
              Rs. {discountedPrice}
            </span>
              {activeDiscount && (
                  <div className="space-x-1 sm:space-x-2 text-sm sm:text-base">
                <span className="line-through text-gray-400">
                  {product.price}
                </span>
                    <span>-{activeDiscount.discountPercentage}%</span>
                  </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default ProductCard;
