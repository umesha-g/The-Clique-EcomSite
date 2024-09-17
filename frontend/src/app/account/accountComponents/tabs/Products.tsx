import axios from "axios";
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

export const Products: React.FC<Product> = () => {
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
        const response = await axios.get(
          "http://localhost:8080/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
        const response = await axios.get(
          "http://localhost:8080/api/products/seller",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <h3 className="font-bold">{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
