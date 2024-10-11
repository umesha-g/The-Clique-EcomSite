package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.request.CartRequest;
import com.umesha_g.the_clique_backend.dto.response.CartResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private  CartService cartService;
    private  ModelMapper modelMapper;

    @Autowired
    public CartController(CartService cartService, ModelMapper modelMapper) {
        this.cartService = cartService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() throws ResourceNotFoundException {
        return ResponseEntity.ok(modelMapper.map(cartService.getCart(),CartResponse.class));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody CartRequest request) throws ResourceNotFoundException {
        return ResponseEntity.ok(cartService.addToCart(request.getProductId(), request.getQuantity()));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable String productId,
            @RequestBody CartRequest request) throws ResourceNotFoundException {
        return ResponseEntity.ok(cartService.updateQuantity(productId, request.getQuantity()));
    }

    @PostMapping("/items/{productId}/increment")
    public ResponseEntity<CartResponse> incrementQuantity(@PathVariable String productId) throws ResourceNotFoundException {
        return ResponseEntity.ok(cartService.incrementQuantity(productId));
    }

    @PostMapping("/items/{productId}/decrement")
    public ResponseEntity<CartResponse> decrementQuantity(@PathVariable String productId) throws ResourceNotFoundException {
        return ResponseEntity.ok(cartService.decrementQuantity(productId));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(@PathVariable String productId) throws ResourceNotFoundException {
        return ResponseEntity.ok(cartService.removeFromCart(productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() throws ResourceNotFoundException {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}