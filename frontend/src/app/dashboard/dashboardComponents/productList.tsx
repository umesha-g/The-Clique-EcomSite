import { deleteProduct } from "@/api/products";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ProductListProps {
  products: Product[];
  onProductUpdate: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductUpdate,
}) => {
  const router = useRouter();

  const handleEdit = (productId: string) => {
    router.push(`/dashboard/addorModifyProduct/${productId}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      onProductUpdate();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-gray-700">
              <td className="px-4 py-2 flex items-center">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={96} // w-12 in Tailwind corresponds to 48px
                  height={96} // h-12 in Tailwind corresponds to 48px
                  className="object-cover mr-4"
                />
                <span>{product.name}</span>
              </td>
              <td className="px-4 py-2">${product.price.toFixed(2)}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(product.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
