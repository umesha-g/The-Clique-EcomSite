import { BrandResponse } from '@/api/admin/admin-brand-api';
import { CategoryResponse } from '@/api/admin/admin-category-api';
import { DiscountResponse } from '@/api/admin/admin-discount-api';
import {
  createProduct,
  deleteProduct,
  ProductRequest,
  ProductResponse,
} from '@/api/admin/admin-product-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const ProductsPanel: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [newProduct, setNewProduct] = useState<ProductRequest>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    brandId: '',
    categoryId: '',
    discountId: '',
    gender: '',
    sizes: [''],
    colors: [''],
  });
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [discounts, setDiscounts] = useState<DiscountResponse[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<ProductResponse | null>(
    null,
  );

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategories();
    fetchDiscounts();
  }, []);

  const fetchProducts = async () => {
    // Implement this function to fetch products
    setProducts([]);
  };

  const fetchBrands = async () => {
    // Implement this function to fetch brands
    setBrands([]);
  };

  const fetchCategories = async () => {
    // Implement this function to fetch categories
    setCategories([]);
  };

  const fetchDiscounts = async () => {
    // Implement this function to fetch discounts
    setDiscounts([]);
  };

  const handleCreateProduct = async () => {
    try {
      const createdProduct = await createProduct(newProduct);
      setCreatedProduct(createdProduct);
      setIsFlipped(true);
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // const handleUpdateProduct = async (
  //   id: string,
  //   updatedProduct: ProductRequest,
  // ) => {
  //   try {
  //     await updateProduct(id, updatedProduct);
  //     fetchProducts();
  //   } catch (error) {
  //     console.error('Error updating product:', error);
  //   }
  // };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // const handleImageUpload = async (file: File) => {
  //   if (createdProduct) {
  //     try {
  //       await uploadProductImage(createdProduct.id, file);
  //       fetchProducts();
  //       // Reset the form and flip the card back
  //       setNewProduct({
  //         name: '',
  //         price: 0,
  //         stock: 0,
  //         description: '',
  //         brandId: '',
  //         categoryId: '',
  //         discountId: '',
  //         gender: '',
  //         sizes: [''],
  //         colors: [''],
  //       });
  //       setCreatedProduct(null);
  //       setIsFlipped(false);
  //     } catch (error) {
  //       console.error('Error uploading product image:', error);
  //     }
  //   }
  // };

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Products Management</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="relative w-full h-[400px]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front side of the card */}
          <motion.div
            className="absolute w-full h-full backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: Number(e.target.value),
                  })
                }
              />
              <Select
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, brandId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, discountId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Discount" />
                </SelectTrigger>
                <SelectContent>
                  {discounts.map((discount) => (
                    <SelectItem key={discount.id} value={discount.id}>
                      {discount.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateProduct} className="col-span-2">
                Next
              </Button>
            </div>
          </motion.div>

          {/* Back side of the card */}
          <motion.div
            className="absolute w-full h-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full h-48 bg-gray-200 mb-4 flex items-center justify-center">
                {/* Placeholder for image upload component */}
                <p>Image Upload Component Goes Here</p>
              </div>
              <Button onClick={() => setIsFlipped(false)}>
                Create Product
              </Button>
            </div>
          </motion.div>
        </motion.div>

        <Table className="mt-8">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product?.brandName}</TableCell>
                <TableCell>{product.categoryName}</TableCell>
                <TableCell>{product.activeDiscount?.name}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductsPanel;
