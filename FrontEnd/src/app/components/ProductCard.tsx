"use client";

import { motion } from "framer-motion";
import AddToCartButton from "../home/addToCartButton";
import WishlistHeartButton from "./wishlistHeartButton";
import {prefix} from "@/utils/apiConfig";
import {ProductCardResponse} from "@/api/product-api";
import {createProductSlug} from "@/utils/productSlug";
import {FaStar} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {MiniDiscountResponse} from "@/api/discount-api";

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

const productCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const productSlug = createProductSlug(product.name, product.id);

  const activeDiscount = product.directDiscount ?
      product.directDiscount : product.otherDiscount;

  const discountedPrice = activeDiscount
      ? product.price * (1 - activeDiscount.discountPercentage / 100)
      : product.price;

  const goToPage = () => {
    router.push(`/product/${productSlug}`);
  };

  return (
      <div className="w-fit h-auto rounded-none">
        <motion.div
          key={product.id}
          variants={containerVariants}
          className="w-fit h-auto"
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className={"bg-white rounded-none border p-4 w-56 flex-none"}
          >
            <WishlistHeartButton productId={product.id} />
            <div onClick={goToPage} className="">
              <div className="relative border-b w-auto max-h-60 h-60">
                <img
                    src={prefix + product.cardImageUrl}
                    alt={product.name}
                    width={250}
                    height={250}
                    className="rounded-none"
                />
              </div>

              <h3 className="my-2">{product.name}</h3>

              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                      <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                          }`}
                      />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
              ({product.purchaseCount})
            </span>
              </div>

              <div className="mt-1 flex items-center justify-between">
                <span className="text-red-500 text-lg font-semibold">
                  Rs. {discountedPrice}
                </span>
                {activeDiscount && (
                  <div className={"space-x-2"}>
                      <span className="line-through text-gray-400 ">
                        {product.price}
                      </span>
                      <span className=" ">
                        -{activeDiscount?.discountPercentage}%
                      </span>
                  </div>
                )}
              </div>
            </div>
          {/*  <div className=" mt-4">*/}
          {/*  <AddToCartButton productId={product.id} />*/}
          {/*</div>*/}
          </motion.div>
        </motion.div>
      </div>

  );
};

export default productCard;
