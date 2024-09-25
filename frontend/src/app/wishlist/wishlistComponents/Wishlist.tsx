import { fetchWishlist, removeFromWishlist } from "@/api/wishlist";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split("=")[1];
    if (!token) {
      router.push("/login");
    } else {
      loadWishlist();
    }
  }, [router]);

  const loadWishlist = async () => {
    try {
      const items = await fetchWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromWishlist(productId);
    setWishlistItems(wishlistItems.filter((item) => item.id !== productId));
  };

  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`);
    // Implement actual add to cart logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6 dark:text-white">My Wishlist</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Unit Price</TableHead>
            {/*<TableHead>Stock Status</TableHead>*/}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wishlistItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>€{item.price.toFixed(2)}</TableCell>
              {/*<TableCell>{item.stockStatus}</TableCell>*/}
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleAddToCart(item.id)}
                    variant="default"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleRemoveItem(item.id)}
                    variant="outline"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default Wishlist;
