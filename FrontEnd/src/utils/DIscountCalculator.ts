

export const calculateDiscountedPrice = (product:any) => {
    const directDiscount = product.directDiscount;
    const otherDiscount = product.otherDiscount;

    if (directDiscount) {
        return product.price * (1 - directDiscount.discountPercentage / 100);
    }

    else if (otherDiscount) {
        return product.price * (1 - otherDiscount.discountPercentage / 100);
    }

    return product.price;
};


export const ActiveDiscount = (product:any) => {
    if (product.directDiscount != null) {
        return product.directDiscount;
    } else if (product.otherDiscount != null) {
        return product.otherDiscount;
    }
    return undefined;
};

// <div className="flex items-center space-x-2">
// <Truck className="h-5 w-5 text-gray-500" />
//     <span>Free Shipping</span>
// </div>
//
// <div className="flex items-center space-x-2">
// <ShieldCheck className="h-5 w-5 text-green-500" />
//     <span>Authentic Product</span>
// </div>