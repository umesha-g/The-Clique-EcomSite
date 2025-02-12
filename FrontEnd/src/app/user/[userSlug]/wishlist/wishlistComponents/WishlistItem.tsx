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
    <Card className="rounded-none hover:bg-neutral-100 transition-all duration-300">
        <CardContent className="p-2">
            <div className="flex items-start sm:items-center w-full gap-4">
                <Link href={`/product/${item.id}`} className={"w-full justify-start items-left flex sm:w-full"}>
                    <div className={"relative aspect-square w-20 h-20 sm:w-24 sm:h-24 border"}>
                        <Image
                            src={prefix + item.cardImageUrl}
                            alt={item.name}
                            fill
                            className="object-cover rounded-nano"
                        />
                    </div>
                    <div className={"ml-3 sm:ml-5 sm:flex sm:justify-center"}>
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <h3 className="sm:text-xl font-semibold hover:text-primary transition-colors">
                                {item.name}
                            </h3>
                            <div className={"flex"}>
                                <div className={"flex flex-col justify-start"}>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                                    i < Math.floor(item.rating)
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs sm:text-sm mt-1  items-center text-gray-500">
                                      ({item.purchaseCount} sold)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="flex flex-col sm:flex-row items-end sm:items-center">
                    <div className="text-right">
                        {item.directDiscount || item.otherDiscount ? (
                            <div className="flex flex-col  items-end sm:items-center sm:space-x-4">
                                    <span className="text-sm sm:text-xl font-semibold text-primary">
                                      Rs.{calculateDiscountedPrice(item).toFixed(2)}
                                    </span>
                                <div className="flex flex-col sm:flex-row items-end sm:items-center mt-1">
                                      <span className="line-through text-gray-500 text-xs sm:text-base">
                                        Rs.{item.price.toFixed(2)}
                                      </span>
                                </div>
                            </div>
                        ) : (
                            <span className="sm:text-xl font-semibold">
                                Rs.{item.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <div className={"w-20 ml-8"}>
                        {(item.directDiscount || item.otherDiscount) && (
                            <span className="text-red-800 hidden sm:block ">
                          {ActiveDiscount(item)?.discountPercentage}% OFF
                        </span>
                        )}
                    </div>

                    <Button
                        variant="destructive"
                        className="rounded-none w-8 h-8 sm:w-12 sm:h-12 sm:ml-10 mt-2"
                        onClick={() => onRemove(item.id)}
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>

            <div className="flex-grow space-y-2">
                {item.stock <= 5 && (
                    <Badge variant="destructive" className="mt-2">
                        Only {item.stock} left in stock
                    </Badge>
                )}
            </div>
        </CardContent>
    </Card>
);

export default WishlistItem;