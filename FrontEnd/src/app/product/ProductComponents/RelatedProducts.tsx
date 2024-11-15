import { ProductCardResponse } from "@/api/product-api";
import Link from "next/link";
import {motion} from "framer-motion";
import {createProductSlug} from "@/utils/productSlug";

interface RelatedProductsProps {
    products: ProductCardResponse[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Related Products</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/product/${createProductSlug(product.name, product.id)}`}
                    >
                        <motion.div
                            className="flex-shrink-0 w-64"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={product.cardImageUrl}
                                alt={product.name}
                                className="w-full h-64 object-cover mb-2 rounded-lg"
                            />
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-gray-600">${product.price.toFixed(2)}</p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};