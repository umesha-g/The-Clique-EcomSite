package com.umesha_g.store_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.umesha_g.store_backend.model.Cart;
import com.umesha_g.store_backend.service.CartService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<Cart>> getCartItems(HttpServletRequest request) {
        List<Cart> cartItems = cartService.getCartItems(request);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Cart> addToCart(HttpServletRequest request, @PathVariable String productId) {
        Cart cartItem = cartService.addToCart(request, productId);
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(HttpServletRequest request, @PathVariable String cartItemId) {
        cartService.removeFromCart(request, cartItemId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> updateCartItemQuantity(
            HttpServletRequest request,
            @PathVariable String cartItemId,
            @RequestParam int quantityChange) {
        Cart updatedItem = cartService.updateCartItemQuantity(request, cartItemId, quantityChange);
        if (updatedItem == null) {
            return ResponseEntity.ok().build(); // Item was removed due to quantity becoming 0
        }
        return ResponseEntity.ok(updatedItem);
    }
}
