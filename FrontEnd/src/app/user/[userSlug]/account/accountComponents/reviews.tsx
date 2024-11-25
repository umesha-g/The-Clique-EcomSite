import React, { useState, useEffect } from 'react';
import { getUserReviews, ReviewResponse } from '@/api/review-api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';
import { Pagination } from "@/app/components/PaginationComponent";
import Image from "next/image";

export const UserReviews = () => {
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewData = await getUserReviews(page);
                setReviews(reviewData.content);
                setTotalPages(reviewData.totalPages);
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            }
        };

        fetchReviews();
    }, [page]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <Card key={review.createdAt} className="rounded-none">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <span>{review.userFirstName}`&apos;`s Review</span>
                                <div className="flex">{renderStars(review.rating)}</div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {review.comment && <p>{review.comment}</p>}
                        {review.imageUrls && review.imageUrls.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {review.imageUrls.map((url) => (
                                    <Image
                                        key={url}
                                        src={url}
                                        alt="Review Image"
                                        className="rounded-none w-full h-24 object-cover"
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}

            {reviews.length === 0 && (
                <div className="text-center text-muted-foreground p-8">
                    No reviews yet
                </div>
            )}

            <div className="flex justify-center mt-4">
                <Pagination
                    currentPage={page + 1}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage - 1)}
                />
            </div>
        </div>
    );
};