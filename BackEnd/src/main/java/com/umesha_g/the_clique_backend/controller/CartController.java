package com.umesha_g.the_clique_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        return ResponseEntity.ok(cartService.getUserCart());
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request.getProductId(), request.getQuantity()));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable String productId,
            @RequestBody CartRequest request) {
        return ResponseEntity.ok(cartService.updateQuantity(productId, request.getQuantity()));
    }

    @PostMapping("/items/{productId}/increment")
    public ResponseEntity<CartResponse> incrementQuantity(@PathVariable String productId) {
        return ResponseEntity.ok(cartService.incrementQuantity(productId));
    }

    @PostMapping("/items/{productId}/decrement")
    public ResponseEntity<CartResponse> decrementQuantity(@PathVariable String productId) {
        return ResponseEntity.ok(cartService.decrementQuantity(productId));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(@PathVariable String productId) {
        return ResponseEntity.ok(cartService.removeFromCart(productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}