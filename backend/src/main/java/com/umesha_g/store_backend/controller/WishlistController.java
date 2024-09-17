package com.umesha_g.store_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umesha_g.store_backend.model.Wishlist;
import com.umesha_g.store_backend.model.WishlistItem;
import com.umesha_g.store_backend.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Wishlist>> getAllWishlists() {
        return ResponseEntity.ok(wishlistService.getAllWishlists());
    }

    @PostMapping
    public ResponseEntity<Wishlist> createWishlist(@RequestBody Wishlist wishlist) {
        return ResponseEntity.status(HttpStatus.CREATED).body(wishlistService.createWishlist(wishlist));
    }

    @PostMapping("/{wishlistId}/items")
    public ResponseEntity<Void> addItemToWishlist(@PathVariable Long wishlistId, @RequestBody WishlistItem item) {
        wishlistService.addItemToWishlist(wishlistId, item);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItemFromWishlist(@PathVariable Long itemId) {
        wishlistService.removeItemFromWishlist(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<Void> deleteWishlist(@PathVariable Long wishlistId) {
        wishlistService.deleteWishlist(wishlistId);
        return ResponseEntity.noContent().build();
    }
}
