package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.ProductSearchDTO;
import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.service.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/products")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @ModelAttribute ProductSearchDTO searchDTO) {
        return ResponseEntity.ok(searchService.searchProducts(searchDTO));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<ProductResponse>> searchByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(searchService.searchByCategory(category, page, size));
    }
}