import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductResponse } from '@/api/admin/admin-product-api';
import { formatDate } from '@/utils/DateFormatting';
import {TableCell} from "@/components/ui/table"; // You'll need to create this utility function

export default function ProductDetailInfo({ product }: { product: ProductResponse }) {
    return (
        <div className="space-y-6">
            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Price" value={`Rs. ${product.price}`} />
                        <DetailItem label="Stock" value={product.stock.toString()} />
                        <DetailItem label="Category" value={product.category.name} />
                        <DetailItem label="Brand" value={product.brand?.name || 'N/A'} />
                        <DetailItem label="Gender" value={product.gender} />
                        <DetailItem
                            label="Created At"
                            value={formatDate(product.createdAt)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{product.description}</p>
                </CardContent>
            </Card>

            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Variants</CardTitle>
                </CardHeader>
                <CardContent className={"space-y-4"}>
                    <div className="flex gap-2 mb-2">
                        <span>Sizes:</span>
                        {product.sizes.map(size => (
                            <Badge key={size} variant="outline" className="rounded-full w-8 h-8 items-center justify-center text-base font-semibold">
                                {size}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <span>Colors:</span>
                        {product.colors.map(color => (
                            <div className={"flex items-center justify-start space-x-2"}>
                                <div
                                    className={`w-6 h-6 rounded-full ring-1 ring-offset-2`}
                                    style={{ backgroundColor: color.slice(0, 7) }}
                                >
                                </div>
                                <p>{color.slice(8)}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem
                            label="Rating"
                            value={`${product.rating}/5`}
                        />
                        <DetailItem
                            label="Purchase Count"
                            value={product.purchaseCount.toString()}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function DetailItem({
                        label,
                        value
                    }: {
    label: string,
    value: string
}) {
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    );
}