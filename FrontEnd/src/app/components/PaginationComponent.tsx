import React from 'react';
import {
    Pagination as PaginationContainer,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('ellipsis');
            }

            // Show current page and surrounding pages
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <PaginationContainer>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                        className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} rounded-none`}
                    />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                className={"rounded-none"}
                                isActive={page === currentPage}
                                onClick={() => onPageChange(page as number)}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                        className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} rounded-none`}
                    />
                </PaginationItem>
            </PaginationContent>
        </PaginationContainer>
    );
}