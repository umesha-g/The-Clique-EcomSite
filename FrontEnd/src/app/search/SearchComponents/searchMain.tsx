"use client";
import { useEffect, useState, useCallback} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {getProductPriceRange, PriceRange, ProductCardResponse, searchProducts} from "@/api/product-api";
import { FiltersSidebar } from "./FiltersSidebar";
import { SearchResults } from "./SearchResults";
import { Pagination } from "@/app/components/PaginationComponent";
import { getAllCategories } from "@/api/category-api";
import { getActiveBrands } from "@/api/brand-api";
import { MiniCategoryResponse} from "@/api/admin/admin-category-api";
import { MiniBrandResponse} from "@/api/admin/admin-brand-api";
import {Card, CardContent} from "@/components/ui/card";
import { Gender } from "@/api/admin/admin-product-api";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {SlidersHorizontal} from "lucide-react";
import {useIsMobile} from "@/hooks/use-mobile";

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

const initialRange: PriceRange = {minPrice: 0, maxPrice: 10000};

const SearchMain = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTerm = searchParams.get("q") || "";
  const [products, setProducts] = useState<ProductCardResponse[]>([]);
  const [categories, setCategories] = useState<MiniCategoryResponse[]>([]);
  const [brands, setBrands] = useState<MiniBrandResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState<PriceRange>(initialRange);
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: searchTerm,
    page: 0,
    size: 16,
    sort: "createdAt",
  });

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

  const getUrlFriendlyName = useCallback((name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  }, []);

  // Load initial data only once
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getAllCategories(),
          getActiveBrands(),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Update filters based on URL params
  useEffect(() => {
    const categoryName = searchParams.get("category");
    const brandName = searchParams.get("brand");
    const gender = searchParams.get("gender") as Gender | null;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const page = searchParams.get("page");

    setFilters(prev => {
      const newFilters = { ...prev };

      if (categoryName) {
        const category = categories.find(c =>
            c.name.toLowerCase().replace(/\s+/g, '-') === categoryName.toLowerCase()
        );
        if (category) newFilters.categoryId = category.id;
      }

      if (brandName) {
        const brand = brands.find(b =>
            b.name.toLowerCase().replace(/\s+/g, '-') === brandName.toLowerCase()
        );
        if (brand) newFilters.brandId = brand.id;
      }

      if (gender) newFilters.gender = gender as Gender;
      if (minPrice) newFilters.minPrice = Number(minPrice);
      if (maxPrice) newFilters.maxPrice = Number(maxPrice);
      if (sort) newFilters.sort = sort;
      if (page) newFilters.page = Number(page) - 1;
      newFilters.searchTerm = searchTerm;

      return newFilters;
    });
  }, [searchParams, categories, brands, searchTerm]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await searchProducts(filters);
        setProducts(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update URL parameters
    if ('categoryId' in newFilters && categories.length > 0) {
      const category = categories.find(c => c.id === newFilters.categoryId);
      if (category) {
        params.set('category', getUrlFriendlyName(category.name));
      } else {
        params.delete('category');
      }
    }

    if ('brandId' in newFilters && brands.length > 0) {
      const brand = brands.find(b => b.id === newFilters.brandId);
      if (brand) {
        params.set('brand', getUrlFriendlyName(brand.name));
      } else {
        params.delete('brand');
      }
    }

    if ('gender' in newFilters) {
      newFilters.gender ? params.set('gender', newFilters.gender) : params.delete('gender');
    }

    if ('minPrice' in newFilters) {
      newFilters.minPrice ? params.set('minPrice', newFilters.minPrice.toString()) : params.delete('minPrice');
    }

    if ('maxPrice' in newFilters) {
      newFilters.maxPrice ? params.set('maxPrice', newFilters.maxPrice.toString()) : params.delete('maxPrice');
    }

    if ('sort' in newFilters) {
      newFilters.sort ? params.set('sort', newFilters.sort) : params.delete('sort');
    }

    if ('page' in newFilters) {
      const pageNumber = (newFilters.page || 0) + 1;
      pageNumber > 1 ? params.set('page', pageNumber.toString()) : params.delete('page');
    }

    // Update URL without causing a re-render
    router.push(`/search?${params.toString()}`, { scroll: false });

    // Update filters state
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 'page' in newFilters ? newFilters.page || 0 : 0,
    }));
  }, [router, searchParams, categories, brands, getUrlFriendlyName]);

  const handlePageChange = useCallback((page: number) => {
    updateFilters({ page: page - 1 });
  }, [updateFilters]);

  return (
      <div className="flex-col flex">
        <Card className="mt-20 border-0 ">
          <CardContent className="p-0 sm:p-4">
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 w-full min-h-screen">
              {isMounted && isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="mb-4 mx-auto w-full flex rounded-none items-center gap-2">
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

export default SearchMain;