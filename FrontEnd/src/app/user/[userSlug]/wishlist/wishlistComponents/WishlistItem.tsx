import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FaStar } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { prefix } from "@/utils/apiConfig";
import { ActiveDiscount, calculateDiscountedPrice } from "@/utils/DIscountCalculator";
import {ProductCardResponse} from "@/api/product-api";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

const WishlistItem = ({
                          item,
                          onRemove
                      }: {
    item: ProductCardResponse;
    onRemove: (id: string) => void;
}) => (
    <Card className="rounded-none transition-all duration-300">
        <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link href={`/product/${item.id}`} className="w-full sm:w-24">
                    <div className="relative aspect-square w-full sm:w-24 h-24">
                        <Image
                            src={prefix + item.cardImageUrl}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>
                </Link>

                <div className="flex-grow space-y-2">
                    <Link href={`/product/${item.id}`}>
                        <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {item.name}
                        </h3>
                    </Link>

                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.floor(item.rating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">
              ({item.purchaseCount} purchases)
            </span>
                    </div>

                    {item.stock <= 5 && (
                        <Badge variant="destructive" className="mt-2">
                            Only {item.stock} left in stock
                        </Badge>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 mt-4 sm:mt-0">
                    <div className="text-right">
                        {item.directDiscount || item.otherDiscount ? (
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <span className="text-xl font-bold text-primary">
                  ${calculateDiscountedPrice(item).toFixed(2)}
                </span>
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1">
                  <span className="line-through text-gray-500 text-sm">
                    ${item.price.toFixed(2)}
                  </span>
                                    {item.directDiscount && (
                                        <span className="text-red-800 text-sm">
                      {ActiveDiscount(item)?.discountPercentage}% OFF
                    </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <span className="text-xl font-bold">
                ${item.price.toFixed(2)}
              </span>
                        )}
                    </div>

                    <Button
                        variant="destructive"
                        className="rounded-full w-10 h-10 p-0"
                        onClick={() => onRemove(item.id)}
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default WishlistItem;