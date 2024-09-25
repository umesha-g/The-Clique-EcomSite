package com.umesha_g.store_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.Wishlist;
import com.umesha_g.store_backend.service.WishlistService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(HttpServletRequest request) {
        return ResponseEntity.ok(wishlistService.getWishlistProducts(request));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> addProductToWishlist(@PathVariable String productId, HttpServletRequest request) {
        if (wishlistService.addProductToWishlist(productId, request)) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeProductFromWishlist(@PathVariable String productId, HttpServletRequest request) {
        if (wishlistService.removeProductFromWishlist(productId, request)) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping("/item/{id}")
    public ResponseEntity<Product> getWishlistItem(@PathVariable String id, HttpServletRequest request) {
        Wishlist wishlist = wishlistService.findById(id);
        return ResponseEntity.ok(wishlist.getProduct());
    }
}