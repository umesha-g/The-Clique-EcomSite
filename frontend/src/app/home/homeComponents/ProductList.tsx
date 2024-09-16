import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
}
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  seller: User;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserProfile = async (token: string) => {
      try {
        const response = await axios.get("http://localhost:8080/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setIsNewUser(response.data.isNewUser);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        console.log("Product response:", response);
        setProducts(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (axios.isAxiosError(error) && error.response) {
          setError(
            `Failed to load products: ${error.response.status} ${error.response.statusText}`
          );
        } else {
          setError("Failed to load products. Please try again later.");
        }
      }
    };

    if (!token) {
      router.push("/login");
    } else {
      fetchUserProfile(token);
      fetchProducts();
    }
  }, [router, setError, setProducts]);

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="responsive"
                objectFit="cover"
                width={1200}
                height={800}
                className="rounded-lg "
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
              <p className="text-gray-400 mb-4">{product.seller.fullName}</p>
              <p className="text-gray-400 mb-4">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ProductList;
