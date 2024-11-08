import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/app/components/fileUploadComponent';
import {
    getProductImages,
    uploadProductImage,
    deleteProductImage,
    setAsCardImage,
    FileRefResponse,
} from '@/api/admin/admin-product-api';
import { useToast } from '@/hooks/use-toast';

interface ProductImagesFormProps {
    productId: string;
    onComplete: () => void;
}

const ProductImagesForm: React.FC<ProductImagesFormProps> = ({
                                                                 productId,
                                                                 onComplete,
                                                             }) => {
    const [images, setImages] = useState<FileRefResponse[]>([]);
    const [hasCardImage, setHasCardImage] = useState(false);
    const { toast } = useToast();

    const fetchImages = async () => {
        try {
            const fetchedImages = await getProductImages(productId);
            setImages(fetchedImages);
            setHasCardImage(fetchedImages.some((img) => img.cardImage));
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch images",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        fetchImages();
    }, [productId]);

    const handleUpload = async (files: File[]) => {
        try {
            for (const file of files) {
                await uploadProductImage(productId, file);
            }
            await fetchImages();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload images",
                variant: "destructive"
            });
        }
    };

    const handleRemove = async (fileId: string) => {
        try {
            await deleteProductImage(productId, fileId);
            await fetchImages();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove image",
                variant: "destructive"
            });
        }
    };

    const handleSetAsCard = async (fileId: string) => {
        try {
            await setAsCardImage(productId, fileId);
            await fetchImages();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to set card image",
                variant: "destructive"
            });
        }
    };

    const canComplete = images.length > 0 && hasCardImage;

    return (
        <div className="space-y-6 mx-8">
            <div className="space-y-2 ">
                <h3 className="text-lg font-medium">Product Images</h3>
                <p className="text-sm text-gray-500">
                    Upload up to 6 images (1 card image and 5 detail images)
                </p>
            </div>

            <FileUpload
                maxFiles={6}
                onUpload={handleUpload}
                existingFiles={images}
                onRemove={handleRemove}
                onSetAsCard={handleSetAsCard}
                allowCardImage={true}
            />

            <div className="flex justify-end">
                <Button
                    type="button"
                    disabled={!canComplete}
                    onClick={onComplete}
                >
                    Complete
                </Button>
            </div>
        </div>
    );
};

export default ProductImagesForm;