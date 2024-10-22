import React, { useState, useEffect } from 'react';
import FileUpload from "@/app/components/fileUploadComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductImage {
  id: string;
  thumbnailUrl: string;
  isCardImage: boolean;
}

interface ProductImagesProps {
  productId: string;
}

const ProductImages: React.FC<ProductImagesProps> =( productId) => {
  const [cardImage, setCardImage] = useState<ProductImage[]>([]);
  const [detailImages, setDetailImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     loadImages();
  }, [productId]);

  const loadImages = async () => {
    try {
      const response = await fetch(`/api/v1/products/${productId}/images`);
      const data = await response.json();

      setCardImage(data.filter((img: ProductImage) => img.isCardImage));
      setDetailImages(data.filter((img: ProductImage) => !img.isCardImage));
    } finally {
      setLoading(false);
    }
  };

  const handleCardImageUpload = async (files: File[]) => {
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('isCardImage', 'true');

    await fetch(`/api/v1/products/${productId}/images`, {
      method: 'POST',
      body: formData
    });

    await loadImages();
  };

  const handleDetailImagesUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    await fetch(`/api/v1/products/${productId}/images`, {
      method: 'POST',
      body: formData
    });

    loadImages();
  };

  const handleRemoveImage = async (fileId: string) => {
    await fetch(`/api/v1/products/${productId}/images/${fileId}`, {
      method: 'DELETE'
    });

    loadImages();
  };

  const handleSetAsCard = async (fileId: string) => {
    await fetch(`/api/v1/products/${productId}/images/${fileId}/set-as-card`, {
      method: 'PUT'
    });

    loadImages();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs defaultValue="card">
      <TabsList>
        <TabsTrigger value="card">Card Image</TabsTrigger>
        <TabsTrigger value="detail">Detail Images</TabsTrigger>
      </TabsList>

      <TabsContent value="card">
        <FileUpload
          maxFiles={1}
          onUpload={handleCardImageUpload}
          existingFiles={cardImage}
          onRemove={handleRemoveImage}
        />
      </TabsContent>

      <TabsContent value="detail">
        <FileUpload
          maxFiles={8}
          onUpload={handleDetailImagesUpload}
          existingFiles={detailImages}
          onRemove={handleRemoveImage}
          onSetAsCard={handleSetAsCard}
          allowCardImage
        />
      </TabsContent>
    </Tabs>
  );
}

export default ProductImages;