import { motion } from "framer-motion";
import Image from "next/image";
import AddToCartButton from "./addToCartButton";
import WishlistHeartButton from "./wishlistHeartButton";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: User;
}

interface ProductCardProps {
  product: Product;
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
  return (
    <div className="w-fit h-auto">
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
          className="bg-white rounded-lg shadow-lg p-4 w-64 flex-none"
        >
          <WishlistHeartButton productId={product.id} />
          <div className="relative">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={250}
              height={250}
              className="rounded-lg"
            />
            {product.discount && (
              <motion.div
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "backInOut" }}
              >
                {product.discount}
              </motion.div>
            )}
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-bold">{product.name}</h3>
            <p className="text-xs text-gray-500">{product.description}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-red-500 font-semibold">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="line-through text-gray-400 text-xs">
                  {product.originalPrice}
                </span>
              )}
            </div>
            <div className=" my-4">
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default productCard;
