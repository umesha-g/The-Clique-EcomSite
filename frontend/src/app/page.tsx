import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaHeart, FaSearch, FaShoppingCart } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchUserProfile(token);
      fetchProducts();
    }
  }, []);

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
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId: number) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.id === Number(productId));
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const handleCheckout = () => {
    // Implement your payment gateway integration here
    alert("Proceeding to payment gateway...");
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Our Store</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative">
              <FaShoppingCart className="text-2xl" />
              {Object.keys(cart).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {Object.values(cart).reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
            {user && (
              <div className="text-sm">
                Welcome, {user.fullName}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                  }}
                  className="ml-2 text-red-500 hover:text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isNewUser && (
        <div className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            Welcome to our store! Start shopping by browsing our products below.
          </div>
        </div>
      )}

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-400 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-full ${
                        wishlist.includes(product.id)
                          ? "bg-red-600"
                          : "bg-gray-700"
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {Object.keys(cart).length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {Object.entries(cart).map(([productId, quantity]) => {
                  const product = products.find(
                    (p) => p.id === Number(productId)
                  );
                  return product ? (
                    <div
                      key={productId}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>{product.name}</span>
                      <div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="px-2 py-1 bg-red-600 rounded mr-2"
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="px-2 py-1 bg-green-600 rounded ml-2"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : null;
                })}
                <div className="mt-4">
                  <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
                </div>
                <button
                  onClick={handleCheckout}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 w-full"
                >
                  Proceed to Checkout
                </button>
              </>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label htmlFor="expiry" className="block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="cvv" className="block mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    placeholder="123"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 w-full"
              >
                Pay ${getTotalPrice().toFixed(2)}
              </button>
            </form>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
