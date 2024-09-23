package com.umesha_g.store_backend.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.Wishlist;
import com.umesha_g.store_backend.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<Set<Product>> getWishlist(@PathVariable String userId) {
        return ResponseEntity.ok(wishlistService.getWishlistProducts(userId));
    }

    @PostMapping("/{userId}/{productId}")
    public ResponseEntity<Void> addProductToWishlist(@PathVariable String userId, @PathVariable String productId) {
        wishlistService.addProductToWishlist(userId, productId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<Void> removeProductFromWishlist(@PathVariable String userId, @PathVariable String productId) {
        wishlistService.removeProductFromWishlist(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/item/{id}")
    public ResponseEntity<Wishlist> getWishlistItem(@PathVariable String id) {
        return ResponseEntity.ok(wishlistService.findById(id));
    }
}