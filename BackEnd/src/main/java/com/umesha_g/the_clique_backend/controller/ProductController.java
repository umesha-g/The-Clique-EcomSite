package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.response.ProductCardResponse;
import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.service.ProductService;
import com.umesha_g.the_clique_backend.service.ProductStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

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
            @RequestParam(required = false) String gender,
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
    public ResponseEntity<String> incrementViewCount(@PathVariable String id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        productStatisticsService.incrementViewCount(product);
        return ResponseEntity.ok("View Count Increased");
    }
}