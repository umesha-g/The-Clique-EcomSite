package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.response.WishlistResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Wishlist;
import com.umesha_g.the_clique_backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private  WishlistService wishlistService;
    private  ModelMapper modelMapper;

    @Autowired
    public WishlistController(WishlistService wishlistService, ModelMapper modelMapper) {
        this.wishlistService = wishlistService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<WishlistResponse> getWishlist() throws ResourceNotFoundException {
        Wishlist wishlist = wishlistService.getWishlist();
        return ResponseEntity.ok(modelMapper.map(wishlist, WishlistResponse.class));
    }

    @PostMapping("/items/{productId}")
    public ResponseEntity<WishlistResponse> addToWishlist(@PathVariable String productId) throws ResourceNotFoundException {
        return ResponseEntity.ok(wishlistService.addToWishlist(productId));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<WishlistResponse> removeFromWishlist(@PathVariable String productId) throws ResourceNotFoundException {
        return ResponseEntity.ok(wishlistService.removeFromWishlist(productId));
    }
}