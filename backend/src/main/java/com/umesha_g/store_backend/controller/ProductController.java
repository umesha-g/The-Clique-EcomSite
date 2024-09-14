package com.umesha_g.store_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.service.ProductService;
import com.umesha_g.store_backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product, @RequestHeader("Authorization") String token) {
        String email = token.replace("Bearer fake-jwt-token-", "");
        User seller = userService.findByEmail(email);
        if (seller == null || !seller.isSeller()) {
            return ResponseEntity.badRequest().body("User not found or not a seller");
        }
        product.setSeller(seller);
        Product savedProduct = productService.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @GetMapping("/seller")
    public ResponseEntity<?> getSellerProducts(@RequestHeader("Authorization") String token) {
        String email = token.replace("Bearer fake-jwt-token-", "");
        User seller = userService.findByEmail(email);
        if (seller == null || !seller.isSeller()) {
            return ResponseEntity.badRequest().body("User not found or not a seller");
        }
        List<Product> products = productService.findBySeller(seller);
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product, @RequestHeader("Authorization") String token) {
        String email = token.replace("Bearer fake-jwt-token-", "");
        User seller = userService.findByEmail(email);
        if (seller == null || !seller.isSeller()) {
            return ResponseEntity.badRequest().body("User not found or not a seller");
        }
        Product existingProduct = productService.findById(id);
        if (existingProduct == null || !existingProduct.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.badRequest().body("Product not found or not owned by the seller");
        }
        product.setId(id);
        product.setSeller(seller);
        Product updatedProduct = productService.save(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        String email = token.replace("Bearer fake-jwt-token-", "");
        User seller = userService.findByEmail(email);
        if (seller == null || !seller.isSeller()) {
            return ResponseEntity.badRequest().body("User not found or not a seller");
        }
        Product existingProduct = productService.findById(id);
        if (existingProduct == null || !existingProduct.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.badRequest().body("Product not found or not owned by the seller");
        }
        productService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
