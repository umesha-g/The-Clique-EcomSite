"use client";
import { motion } from "framer-motion";
import WishlistHeartButton from "./wishlistHeartButton";
import {prefix} from "@/utils/apiConfig";
import {ProductCardResponse, viewCount} from "@/api/product-api";
import {createProductSlug} from "@/utils/productSlug";
import {FaStar} from "react-icons/fa";
import {useRouter} from "next/navigation";
import Image from "next/image";

interface ProductCardProps {
  product: ProductCardResponse;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 2,
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

  const handleClick = async () => {
    await viewCount(product.id);
    router.push(`/product/${productSlug}`);
  }

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
            className="bg-white rounded-none border w-full flex-none"
        >
          <WishlistHeartButton productId={product.id}  className={"absolute z-10 top-4 right-4"}/>
          <div onClick={handleClick} className="cursor-pointer">
            <div className="relative border border-white w-full aspect-square">
              <Image
                  src={prefix + product.cardImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center rounded-none"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  priority
              />
            </div>
            <div className={"p-1 m-1 border text-center items-center flex flex-col"}>
              <h3 className="mb-1 text-sm text-balance sm:text-base font-semibold line-clamp-2">{product.name}</h3>

              <div className="flex items-center gap-1 ">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                      <FaStar
                          key={i}
                          className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${
                              i < Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                          }`}
                      />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                ({product.purchaseCount} sold)
              </span>
              </div>

              <div className="flex items-center justify-between">
              <span className="text-neutral-600 text-sm sm:text-base ">
                Rs. {discountedPrice}
              </span>
                {activeDiscount && (
                    <div className="space-x-1 sm:space-x-2 text-xs sm:text-sm">
                  <span className="line-through text-red-500">
                    {product.price}
                  </span>
                      <span>-{activeDiscount.discountPercentage}%</span>
                    </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default ProductCard;
