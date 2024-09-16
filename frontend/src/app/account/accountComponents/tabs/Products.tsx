import React from "react";

interface ProductsProps {
  products: any[];
}

export const Products: React.FC<ProductsProps> = ({ products }) => (
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
