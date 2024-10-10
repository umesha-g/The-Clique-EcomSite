package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public  ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }
}
//    @GetMapping("/search")
//    public ResponseEntity<Page<ProductResponse>> getSearchProducts(
//            @RequestParam(required = false) String category,
//            @RequestParam(required = false) String brand,
//            @RequestParam(required = false) String Gender,
//            @RequestParam(required = false) BigDecimal minPrice,
//            @RequestParam(required = false) BigDecimal maxPrice,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(defaultValue = "createdAt") String sortBy) {
//
//        ProductFilterDto filter = ProductFilterDto.builder()
//                .category(category)
//                .brand(brand)
//                .gender(Gender)
//                .minPrice(minPrice)
//                .maxPrice(maxPrice)
//                .build();
//
//        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
//        return ResponseEntity.ok(productService.getSearchProducts(filter, pageable));
//    }

