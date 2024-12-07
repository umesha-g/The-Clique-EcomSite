import React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Define sort options that match your backend
const SORT_OPTIONS = [
    { value: "createdAt,desc", label: "Newest First" },
    { value: "price,asc", label: "Price: Low to High" },
    { value: "price,desc", label: "Price: High to Low" },
    { value: "rating,desc", label: "Top Rated" },
    { value: "purchaseCount,desc", label: "Best Selling" },
    { value: "viewCount,desc", label: "Most Viewed" },
    { value: "name,asc", label: "Name: A-Z" },
    { value: "name,desc", label: "Name: Z-A" },
]

interface ProductSortSelectorProps {
    onSortChange: (sortValue: string) => void
    currentSort?: string
}

export const ProductSortSelector: React.FC<ProductSortSelectorProps> = ({
                                                                            onSortChange,
                                                                            currentSort
                                                                        }) => {
    const handleValueChange = (value: string) => {
        onSortChange(value)
    }

    const currentSortLabel = SORT_OPTIONS.find(
        option => option.value === currentSort
    )?.label || "Sort By"

    return (
        <Select
            onValueChange={handleValueChange}
            value={currentSort}
        >
            <SelectTrigger className="w-[180px] rounded-none">
                <SelectValue placeholder="Sort By">
                    {currentSortLabel}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-none">
                {SORT_OPTIONS.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        className="rounded-none"
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}