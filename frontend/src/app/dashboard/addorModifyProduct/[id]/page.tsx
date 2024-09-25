"use client";
import { useParams } from "next/navigation";
import ProductForm from "../addProductComponents/productForm";

export default function EditProduct() {
  const { id } = useParams();

  return <ProductForm productId={id as string} />;
}
