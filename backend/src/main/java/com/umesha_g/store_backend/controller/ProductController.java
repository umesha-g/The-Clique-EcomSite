package com.umesha_g.store_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.service.ProductService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product, HttpServletRequest request) {
        return productService.createProduct(product, request);
    }

    @GetMapping("/seller")
    public List<Product> getSellerProducts(HttpServletRequest request) {
        return productService.getSellerProducts(request);
    }

    @GetMapping("/{productId}")
    public Product getProductById(@PathVariable String productId, HttpServletRequest request) {
        return productService.getProductById(productId, request);
    }

    @PutMapping("/{productId}")
    public Product updateProduct(@PathVariable String productId, @RequestBody Product product,
            HttpServletRequest request) {
        return productService.updateProduct(productId, product, request);
    }

    @DeleteMapping("/{productId}")
    public void deleteProduct(@PathVariable String productId, HttpServletRequest request) {
        productService.deleteProduct(productId, request);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam("q") String query) {
        return productService.searchProducts(query);
    }

    @GetMapping("/searchSuggestions")
    public List<String> getSearchSuggestions(@RequestParam("q") String query) {
        return productService.getSearchSuggestions(query);
    }
}