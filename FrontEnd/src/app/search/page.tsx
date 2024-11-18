"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {getProductPriceRange, PriceRange, ProductCardResponse, searchProducts} from "@/api/product-api";
import { FiltersSidebar } from "./SearchComponents/FiltersSidebar";
import { SearchResults } from "./SearchComponents/SearchResults";
import { Pagination } from "@/app/components/PaginationComponent";
import { getAllCategories } from "@/api/category-api";
import { getActiveBrands } from "@/api/brand-api";
import { MiniCategoryResponse} from "@/api/admin/admin-category-api";
import { MiniBrandResponse} from "@/api/admin/admin-brand-api";
import CommonHeader from "@/app/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Gender } from "@/api/admin/admin-product-api";
import {Sheet,SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {SlidersHorizontal} from "lucide-react";
import {useMediaQuery} from "react-responsive";


export interface FilterState {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: Gender;
  searchTerm?: string;
  page: number;
  size: number;
  sort?: string;
}

const initialRange:PriceRange = {minPrice:0,maxPrice: 10000};
const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTerm = searchParams.get("q") || "";
  const [products, setProducts] = useState<ProductCardResponse[]>([]);
  const [categories, setCategories] = useState<MiniCategoryResponse[]>([]);
  const [brands, setBrands] = useState<MiniBrandResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [priceRange,setPriceRange] = useState<PriceRange>(initialRange);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const loadPriceRange = async () => {
      try {
        const range = await getProductPriceRange();
        setPriceRange(range);
      } catch (err) {
        console.log(err instanceof Error ? err.message : 'Failed to load price range');
      }
    }
    loadPriceRange();
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: searchTerm,
    page: 0,
    size: 16,
    sort: "createdAt",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getAllCategories(),
          getActiveBrands(),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);

        const categoryName = searchParams.get("category");
        const brandName = searchParams.get("brand");
        const gender = searchParams.get("gender") as Gender | null;
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sort = searchParams.get("sort");
        const page = searchParams.get("page");

        const initialFilters: Partial<FilterState> = {};

        if (categoryName) {
          const category = categoriesData.find(c =>
              c.name.toLowerCase().replace(/\s+/g, '-') === categoryName.toLowerCase()
          );
          if (category) initialFilters.categoryId = category.id;
        }

        if (brandName) {
          const brand = brandsData.find(b =>
              b.name.toLowerCase().replace(/\s+/g, '-') === brandName.toLowerCase()
          );
          if (brand) initialFilters.brandId = brand.id;
        }

        if (gender) initialFilters.gender = gender as Gender;
        if (minPrice) initialFilters.minPrice = Number(minPrice);
        if (maxPrice) initialFilters.maxPrice = Number(maxPrice);
        if (sort) initialFilters.sort = sort;
        if (page) initialFilters.page = Number(page) - 1;

        setFilters(prev => ({ ...prev, ...initialFilters }));
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [searchParams]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      searchTerm: searchTerm,
      page: 0
    }));
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await searchProducts(filters);
        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const getUrlFriendlyName = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev };

      if (newFilters.hasOwnProperty('categoryId')) {
        updated.categoryId = newFilters.categoryId;
      }
      if (newFilters.hasOwnProperty('brandId')) {
        updated.brandId = newFilters.brandId;
      }
      if (newFilters.hasOwnProperty('minPrice')) {
        updated.minPrice = newFilters.minPrice;
      }
      if (newFilters.hasOwnProperty('maxPrice')) {
        updated.maxPrice = newFilters.maxPrice;
      }
      if (newFilters.hasOwnProperty('gender')) {
        updated.gender = newFilters.gender;
      }
      if (newFilters.hasOwnProperty('searchTerm')) {
        updated.searchTerm = newFilters.searchTerm;
      }
      if (newFilters.hasOwnProperty('page')) {
        updated.page = newFilters.page ?? 0;
      }
      if (newFilters.hasOwnProperty('size')) {
        updated.size = newFilters.size as number;
      }
      if (newFilters.hasOwnProperty('sort')) {
        updated.sort = newFilters.sort;
      }

      Object.keys(updated).forEach((key) => {
        if (updated[key as keyof FilterState] === undefined) {
          delete updated[key as keyof FilterState];
        }
      });

      if (!newFilters.hasOwnProperty('page')) {
        updated.page = 0;
      }

      return updated;
    });

    const currentParams = new URLSearchParams(window.location.search);

    if (newFilters.hasOwnProperty('categoryId')) {
      if (newFilters.categoryId) {
        const category = categories.find(c => c.id === newFilters.categoryId);
        if (category) {
          currentParams.set('category', getUrlFriendlyName(category.name));
        }
      } else {
        currentParams.delete('category');
      }
    }

    if (newFilters.hasOwnProperty('brandId')) {
      if (newFilters.brandId) {
        const brand = brands.find(b => b.id === newFilters.brandId);
        if (brand) {
          currentParams.set('brand', getUrlFriendlyName(brand.name));
        }
      } else {
        currentParams.delete('brand');
      }
    }

    if (newFilters.hasOwnProperty('gender')) {
      newFilters.gender ? currentParams.set('gender', newFilters.gender) : currentParams.delete('gender');
    }
    if (newFilters.hasOwnProperty('minPrice')) {
      newFilters.minPrice ? currentParams.set('minPrice', String(newFilters.minPrice)) : currentParams.delete('minPrice');
    }
    if (newFilters.hasOwnProperty('maxPrice')) {
      newFilters.maxPrice ? currentParams.set('maxPrice', String(newFilters.maxPrice)) : currentParams.delete('maxPrice');
    }
    if (newFilters.hasOwnProperty('sort')) {
      newFilters.sort ? currentParams.set('sort', newFilters.sort) : currentParams.delete('sort');
    }
    if (newFilters.hasOwnProperty('page')) {
      const pageNumber = (newFilters.page || 0) + 1;
      pageNumber > 1 ? currentParams.set('page', String(pageNumber)) : currentParams.delete('page');
    }

    router.push(`/search?${currentParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page: page - 1 }); // Convert to 0-based for API
  };

  return (
      <div className="flex-col flex">
        <CommonHeader categoryVisibility="hidden" searchBarWidth="96"/>
        <Card className="mt-20 border-0 ">
          <CardContent className="p-0 sm:p-4">
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 w-full min-h-screen">
              {/* Mobile Filter Button */}
              {isMounted && isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="mb-4 w-full flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-0">
                      <FiltersSidebar
                          filters={filters}
                          categories={categories}
                          brands={brands}
                          onFiltersChange={updateFilters}
                          priceRange={priceRange}
                          className="h-full overflow-y-auto"
                      />
                    </SheetContent>
                  </Sheet>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {/* Desktop Sidebar */}
                {isMounted && !isMobile && (
                    <div className="hidden md:block col-span-1">
                      <FiltersSidebar
                          filters={filters}
                          categories={categories}
                          brands={brands}
                          onFiltersChange={updateFilters}
                          priceRange={priceRange}
                      />
                    </div>
                )}

                {/* Search Results */}
                <div className="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-3">
                  <SearchResults
                      products={products}
                      loading={loading}
                      searchTerm={searchTerm}
                  />

                  {!loading && products.length > 0 && (
                      <div className="flex justify-center mt-8">
                        <Pagination
                            currentPage={filters.page + 1}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                      </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default SearchPage;