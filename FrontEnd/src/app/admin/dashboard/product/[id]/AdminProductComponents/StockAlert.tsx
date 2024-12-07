import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ProductResponse } from '@/api/admin/admin-product-api';

export default function StockAlert({ product }: { product: ProductResponse }) {
    const isLowStock = product.stock < 10;

    if (!isLowStock) return null;

    return (
        <Alert variant="destructive" className="mb-6 rounded-none">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Low Stock Warning</AlertTitle>
            <AlertDescription>
                This product is running low on stock. Current inventory: {product.stock} units
            </AlertDescription>
        </Alert>
    );
}