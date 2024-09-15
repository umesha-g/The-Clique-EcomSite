"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/products/seller",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/products/${isEditing}`,
          newProduct,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:8080/api/products", newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setNewProduct({});
      setIsAdding(false);
      setIsEditing(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setNewProduct(product);
    setIsEditing(product.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 fixed flex left-0 right-0">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        </div>
        <button
          className="px-4 py-2 bg-indigo-600 rounded-lg"
          onClick={goToHome}
        >
          Home
        </button>
      </nav>
      <main className="container mx-auto p-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Products</h2>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded"
          >
            Add New Product
          </button>
        </div>
        {isAdding && (
          <div className="mb-8 bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block mb-1">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newProduct.price || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className="block mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={newProduct.imageUrl || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  {isEditing ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(null);
                    setNewProduct({});
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-800 p-4 rounded-lg">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="responsive"
                objectFit="cover"
                width={1200}
                height={800}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-300 mb-2">{product.description}</p>
              <p className="text-xl font-bold mb-4">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
