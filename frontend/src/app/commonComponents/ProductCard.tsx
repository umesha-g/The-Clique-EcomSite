import { motion } from "framer-motion";
import Image from "next/image";

interface User {
  id: number;
  email: string;
  fullName: string;
  isNewUser: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: User;
}

const featuredItems = [
  {
    id: 1,
    title: "Welcome Deal",
    description: "Your exclusive price",
    price: "LKR 1,586.85",
    originalPrice: "LKR 3,305.76",
    discount: "-52%",
    image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
  },
];

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

const FeaturedCarousel = () => {
  return (
    <div className="w-fit h-auto">
      {featuredItems.map((item) => (
        <motion.div
          key={item.id}
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
            <div className="relative">
              <Image
                src={item.image}
                alt={item.title}
                width={250}
                height={250}
                className="rounded-lg"
              />
              <motion.div
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "backInOut" }}
              >
                {item.discount}
              </motion.div>
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-bold">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.description}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-red-500 font-semibold">{item.price}</span>
                <span className="line-through text-gray-400 text-xs">
                  {item.originalPrice}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedCarousel;
