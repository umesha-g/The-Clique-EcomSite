package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.response.ProductCardResponse;
import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.dto.response.ProductSlugResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.enums.Gender;
import com.umesha_g.the_clique_backend.service.ProductService;
import com.umesha_g.the_clique_backend.service.ProductStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private ProductService productService;
    private ProductStatisticsService productStatisticsService;

    @Autowired
    public ProductController(ProductService productService, ProductStatisticsService productStatisticsService) {
        this.productService = productService;
        this.productStatisticsService = productStatisticsService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductCardResponse>> searchProducts(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String brandId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) String searchTerm,
            @PageableDefault Pageable pageable) {

        Page<ProductCardResponse> products = productService.searchProducts(
                categoryId,
                brandId,
                minPrice,
                maxPrice,
                gender,
                searchTerm,
                pageable
        );

        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductCardResponse>> getAllProductsByCategory(
            @PathVariable String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(productService.getAllProductsByCategory(categoryId, pageable));
    }

    @PostMapping("/{id}/view")
    public void incrementViewCount(@PathVariable String id) {
        Product product = productService.getProductById(id);
        productStatisticsService.incrementViewCount(product);
    }

    @GetMapping("/price-range")
    public ResponseEntity<Map<String, BigDecimal>> getPriceRange() {
        return ResponseEntity.ok(productService.getPriceRange());
    }

    @GetMapping("/best-selling")
    public ResponseEntity<List<ProductCardResponse>> getBestSellingProducts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        if (startDate == null || endDate == null) {
            return ResponseEntity.ok(productStatisticsService.getBestSellingProducts());
        }
        return ResponseEntity.ok(productStatisticsService.getBestSellingProducts(startDate, endDate));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<ProductCardResponse>> getTrendingProducts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        if (startDate == null || endDate == null) {
            return ResponseEntity.ok(productStatisticsService.getTrendingProducts());
        }
        return ResponseEntity.ok(productStatisticsService.getTrendingProducts(startDate, endDate));
    }

    @GetMapping("/slugs")
    public ResponseEntity<List<ProductSlugResponse>> getAllProductSlugs() {
        List<ProductSlugResponse> slugs = productService.getAllProductSlugs();
        return ResponseEntity.ok(slugs);
    }

    @GetMapping("/{productId}/related")
    public ResponseEntity<List<ProductCardResponse>> getRelatedProducts(
            @PathVariable String productId,
            @RequestParam(defaultValue = "12") int limit) throws ResourceNotFoundException {

        List<ProductCardResponse> relatedProducts = productService.getRelatedProducts(productId, limit);
        return ResponseEntity.ok(relatedProducts);
    }

    @GetMapping("/deals")
    public ResponseEntity<Page<ProductCardResponse>> getProductsByDiscountRange(
            @RequestParam(required = false) Double minDirectDiscount,
            @RequestParam(required = false) Double maxDirectDiscount,
            @RequestParam(required = false) Double minOtherDiscount,
            @RequestParam(required = false) Double maxOtherDiscount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(required = false) String sortBy
    ) {
        Page<ProductCardResponse> products = productService.getProductsByDiscountRange(
                minDirectDiscount,
                maxDirectDiscount,
                minOtherDiscount,
                maxOtherDiscount,
                page,
                size,
                sortBy
        );

        return ResponseEntity.ok(products);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getProductSuggestions(
            @RequestParam(name = "q", required = false, defaultValue = "") String searchTerm) {
        List<String> suggestions = productService.getProductNameSuggestions(searchTerm);
        return ResponseEntity.ok(suggestions);
    }
}