import React, { useEffect, useState, useCallback } from 'react';
import { BrandResponse } from '@/api/admin/admin-brand-api';
import { CategoryResponse } from '@/api/admin/admin-category-api';
import { DiscountResponse, getAllDiscounts } from '@/api/admin/admin-discount-api';
import {
  getAllProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  ProductRequest,
  ProductResponse,
} from '@/api/admin/admin-product-api';
import { getAllBrands } from '@/api/brand-api';
import { getAllCategories } from '@/api/category-api';
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
import ProductImages from "@/app/admin/dashboard/adminDashboard_Components/productImagesComponent";
import debounce from 'lodash/debounce';
import {getActiveDiscounts, MiniDiscountResponse} from "@/api/discount-api";

const ProductsPanel: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
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
  const [discounts, setDiscounts] = useState<MiniDiscountResponse[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<ProductResponse | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
      debounce((term: string) => {
        fetchProducts(term);
      }, 300),
      []
  );

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchDiscounts();
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, currentPage, debouncedSearch]);

  const fetchProducts = async (searchTerm: string = '') => {
    try {
      const response = await getAllProducts(currentPage, pageSize, 'createdAt', searchTerm);
      setProducts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const brandsData = await getAllBrands();
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const discountsData = await getActiveDiscounts();
      setDiscounts(discountsData);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const handleCreateOrUpdateProduct = async () => {
    try {
      if (isUpdating && selectedProductId) {
        await updateProduct(selectedProductId, newProduct);
        setIsUpdating(false);
        setSelectedProductId(null);
      } else {
        const createdProductData = await createProduct(newProduct);
        setCreatedProduct(createdProductData);
        setIsFlipped(true);
      }
      fetchProducts(searchTerm);
    } catch (error) {
      console.error('Error creating/updating product:', error);
    }
  };

  const handleUpdateClick = (product: ProductResponse) => {
    setNewProduct({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      brandId: brands.find(b => b.name === product.brandName)?.id || '',
      categoryId: categories.find(c => c.name === product.categoryName)?.id || '',
      discountId: product.activeDiscount?.id || '',
      gender: product.gender,
      sizes: product.sizes,
      colors: product.colors,
    });
    setIsUpdating(true);
    setSelectedProductId(product.id);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts(searchTerm);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFinishCreating = () => {
    setIsFlipped(false);
    setNewProduct({
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
    setCreatedProduct(null);
    setIsUpdating(false);
    setSelectedProductId(null);
    fetchProducts(searchTerm);
  };

  return (
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Products Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-8"
          />
          <h4 className={'mb-4'}>Add/Update Products</h4>
          <motion.div
              className="relative w-full h-[230px]"
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
                    value={newProduct.brandId}
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
                    value={newProduct.categoryId}
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
                    value={newProduct.discountId}
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
                          {discount.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateOrUpdateProduct} className="col-span-2">
                  {isUpdating ? 'Update Product' : 'Next'}
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
              <div className="flex flex-col h-full">
                {createdProduct && (
                    <div className="flex-1 overflow-y-auto">
                      <ProductImages productId={createdProduct.id} />
                    </div>
                )}
                <Button onClick={handleFinishCreating} className="mt-4">
                  Finish
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
                    <TableCell className="space-x-2">
                      <Button
                          onClick={() => handleUpdateClick(product)}
                          variant="outline"
                      >
                        Update
                      </Button>
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

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Total items: {totalElements}
            </div>
            <div className="flex gap-2">
              <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  variant="outline"
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
              Page {currentPage + 1} of {totalPages}
            </span>
              <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  variant="outline"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

export default ProductsPanel;