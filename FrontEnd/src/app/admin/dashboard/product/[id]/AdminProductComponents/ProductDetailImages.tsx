import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { prefix } from '@/utils/apiConfig';
import { ProductResponse } from '@/api/admin/admin-product-api';

export default function ProductDetailImages({ product }: { product: ProductResponse }) {
    return (
        <Card className="rounded-none">
            <CardContent className="p-6 grid grid-cols-1 gap-4">
                {/*<div className="w-full aspect-square relative">*/}
                {/*    <Image*/}
                {/*        src={prefix + product.cardImageUrl}*/}
                {/*        alt={product.name}*/}
                {/*        fill*/}
                {/*        className="object-cover rounded-none"*/}
                {/*    />*/}
                {/*</div>*/}
                <div className="grid grid-cols-4 gap-2">
                    {product.detailImageUrls.map((imageUrl, index) => (
                        <div key={index} className="aspect-square relative">
                            <Image
                                src={prefix + imageUrl}
                                alt={`${product.name} detail ${index + 1}`}
                                fill
                                className="object-cover rounded-none"
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}