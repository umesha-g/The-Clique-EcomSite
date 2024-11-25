"use client";
import {Card} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Slider} from "@/components/ui/slider";
import {MiniCategoryResponse} from "@/api/admin/admin-category-api";
import {MiniBrandResponse} from "@/api/admin/admin-brand-api";
import {FilterState} from "@/app/search/SearchComponents/searchMain";
import {Gender} from "@/api/admin/admin-product-api";
import {PriceRange} from "@/api/product-api";
import {cn} from "@/lib/utils";
import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

interface FiltersSidebarProps {
    filters: FilterState;
    categories: MiniCategoryResponse[];
    brands: MiniBrandResponse[];
    onFiltersChange: (filters: Partial<FilterState>) => void;
    priceRange: PriceRange;
}

export const FiltersSidebar = ({
                                   filters,
                                   categories,
                                   brands,
                                   onFiltersChange,
                                   priceRange,
                                   className
                               }: FiltersSidebarProps & { className?: string }) => {
    const sortOptions = [
        {value: "createdAt", label: "Newest First"},
        {value: "price,asc", label: "Price: Low to High"},
        {value: "price,desc", label: "Price: High to Low"},
        {value: "rating,desc", label: "Highest Rated"},
        {value: "purchaseCount,desc", label: "Most Popular"},
    ];

    const genderOptions = Object.values(Gender).map(gender => ({
        value: gender,
        label: gender.charAt(0) + gender.slice(1).toLowerCase()
    }));

    // Local state for price range
    const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
        filters.minPrice || Math.floor(priceRange.minPrice),
        filters.maxPrice || Math.ceil(priceRange.maxPrice)
    ]);

    // Update local price range when filters change
    useEffect(() => {
        setLocalPriceRange([
            filters.minPrice || Math.floor(priceRange.minPrice),
            filters.maxPrice || Math.ceil(priceRange.maxPrice)
        ]);
    }, [filters.minPrice, filters.maxPrice, priceRange.minPrice, priceRange.maxPrice]);

    // Debounced function to update filters
    const debouncedPriceUpdate = useCallback(
        debounce((value: [number, number]) => {
            onFiltersChange({ minPrice: value[0], maxPrice: value[1] });
        }, 500),
        [onFiltersChange]
    );

    // Handle price range change
    const handlePriceRangeChange = (value: number[]) => {
        const newValue: [number, number] = [value[0], value[1]];
        setLocalPriceRange(newValue);
        debouncedPriceUpdate(newValue);
    };

    const handleCategoryChange = (value: string) => {
        if (value === "all") {
            onFiltersChange({ categoryId: undefined });
        } else {
            onFiltersChange({ categoryId: value });
        }
    };

    const handleBrandChange = (value: string) => {
        if (value === "all") {
            onFiltersChange({ brandId: undefined });
        } else {
            onFiltersChange({ brandId: value });
        }
    };

    const handleGenderChange = (value: string) => {
        if (value === "all") {
            onFiltersChange({ gender: undefined });
        } else {
            onFiltersChange({ gender: value as Gender });
        }
    };

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedPriceUpdate.cancel();
        };
    }, [debouncedPriceUpdate]);

    return (
        <Card className={cn(
            "p-4 bg-beige-100 rounded-none",
            "md:sticky md:top-24",
            className
        )}>
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            <div className="space-y-6">
                <div className="mb-6">
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="space-y-4">
                        <Slider
                            defaultValue={[Math.floor(priceRange.minPrice), Math.ceil(priceRange.maxPrice)]}
                            max={Math.ceil(priceRange.maxPrice)}
                            min={Math.floor(priceRange.minPrice)}
                            step={1}
                            value={localPriceRange}
                            onValueChange={handlePriceRangeChange}
                        />
                        <div className="flex justify-between text-sm">
                            <span>Rs.{localPriceRange[0]}</span>
                            <span>Rs.{localPriceRange[1]}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-medium mb-2">Category</h3>
                    <Select
                        value={filters.categoryId || "all"}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger className={"rounded-none"}>
                            <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent className={"rounded-none"}>
                            <SelectItem className={"rounded-none"} value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem className={"rounded-none"} key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-6">
                    <h3 className="font-medium mb-2">Brand</h3>
                    <Select
                        value={filters.brandId || "all"}
                        onValueChange={handleBrandChange}
                    >
                        <SelectTrigger className={"rounded-none"}>
                            <SelectValue placeholder="Select brand..." />
                        </SelectTrigger>
                        <SelectContent className={"rounded-none"}>
                            <SelectItem className={"rounded-none"} value="all">All Brands</SelectItem>
                            {brands.map((brand) => (
                                <SelectItem className={"rounded-none"} key={brand.id} value={brand.id}>
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-6">
                    <h3 className="font-medium mb-2">Gender</h3>
                    <Select
                        value={filters.gender || "all"}
                        onValueChange={handleGenderChange}
                    >
                        <SelectTrigger className={"rounded-none"}>
                            <SelectValue placeholder="Select gender..." />
                        </SelectTrigger>
                        <SelectContent className={"rounded-none"}>
                            <SelectItem className={"rounded-none"} value="all">All</SelectItem>
                            {genderOptions.map((option) => (
                                <SelectItem
                                    className={"rounded-none"}
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-6">
                    <h3 className="font-medium mb-2">Sort By</h3>
                    <Select
                        value={filters.sort}
                        onValueChange={(value) => onFiltersChange({ sort: value })}
                    >
                        <SelectTrigger className={"rounded-none"}>
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent className={"rounded-none"}>
                            {sortOptions.map((option) => (
                                <SelectItem className={"rounded-none"} key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Card>
    );
};