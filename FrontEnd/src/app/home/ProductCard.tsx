import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  cardImageUrl: string;
  purchaseCount: number;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="flex-col flex ">
      <Link href="#" className="w-full h-full">
        <Image
          src={product.cardImageUrl}
          alt={product.name}
          width={300}
          height={400}
          className="w-full h-64 object-cover mb-2"
        />
        <div className="">
          <h3 className="text-lg  text-neutral-700">{product.name}</h3>
          <p className="text-neutral-500 ">${product.price}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
