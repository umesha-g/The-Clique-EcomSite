package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.request.CartRequest;
import com.umesha_g.the_clique_backend.dto.response.CartResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<CartResponse> getCart() throws ResourceNotFoundException {
        return ResponseEntity.ok(modelMapper.map(cartService.getCart(),CartResponse.class));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody CartRequest request) throws ResourceNotFoundException {
        return ResponseEntity.ok(cartService.addToCart(request.getProductId(), request));
    }

//    @PutMapping("/items/{productId}")
//    public ResponseEntity<CartResponse> updateQuantity(
//            @PathVariable String productId,
//            @RequestBody CartRequest request) throws ResourceNotFoundException {
//        return ResponseEntity.ok(cartService.updateQuantity(productId, request.getQuantity()));
//    }

    @PostMapping("/items/{productId}/increment")
    public ResponseEntity<CartResponse> incrementQuantity(
            @PathVariable String productId,
            @RequestParam String color,
            @RequestParam String size) throws ResourceNotFoundException {
        return ResponseEntity.ok(cartService.incrementQuantity(productId, color, size));
    }

    @PostMapping("/items/{productId}/decrement")
    public ResponseEntity<CartResponse> decrementQuantity(
            @PathVariable String productId,
            @RequestParam String color,
            @RequestParam String size) throws ResourceNotFoundException {
        return ResponseEntity.ok(cartService.decrementQuantity(productId, color, size));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable String productId,
            @RequestParam(required = true) String color,
            @RequestParam(required = true) String size) throws ResourceNotFoundException {
        return ResponseEntity.ok(cartService.removeFromCart(productId, color, size));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() throws ResourceNotFoundException {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}