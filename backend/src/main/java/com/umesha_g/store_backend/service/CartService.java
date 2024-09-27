package com.umesha_g.store_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.umesha_g.store_backend.model.Cart;
import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.repository.CartRepository;
import com.umesha_g.store_backend.repository.ProductRepository;
import com.umesha_g.store_backend.util.CookieUtil;
import com.umesha_g.store_backend.util.IdGen;
import com.umesha_g.store_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CookieUtil cookieUtil;

    @Autowired
    private IdGen idGen;

    public Cart findCartItemById(String id) {
        return cartRepository.findById(id).orElse(null);
    }

    private User getUserFromRequest(HttpServletRequest request) {
        String token = cookieUtil.getTokenFromCookie(request);
        if (token == null) {
            throw new RuntimeException("Authentication token not found");
        }
        String email = jwtUtil.extractEmail(token);
        return userService.findByEmail(email);
    }

    public List<Cart> getCartItems(HttpServletRequest request) {
        User user = getUserFromRequest(request);
        return cartRepository.findByUser(user);
    }

    public Cart addToCart(HttpServletRequest request, @RequestParam String productId) {
        User user = getUserFromRequest(request);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Cart> existingCartItem = cartRepository.findByUserAndProduct(user, product);

        if (existingCartItem.isPresent()) {
            Cart cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + 1);
            return cartRepository.save(cartItem);
        } else {
            Cart cartItem = new Cart();
            cartItem.setId(idGen.generateId("Cart"));
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(1);
            return cartRepository.save(cartItem);
        }
    }

    public Cart updateCartItemQuantity(HttpServletRequest request, String cartItemId, int quantityChange) {
        User user = getUserFromRequest(request);
        Cart cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().equals(user)) {
            throw new RuntimeException("Unauthorized access to cart item");
        }

        int newQuantity = cartItem.getQuantity() + quantityChange;
        if (newQuantity <= 0) {
            cartRepository.delete(cartItem);
            return null;
        } else {
            cartItem.setQuantity(newQuantity);
            return cartRepository.save(cartItem);
        }
    }

    public void removeFromCart(HttpServletRequest request, String cartItemId) {
        User user = getUserFromRequest(request);
        Cart cartItem = cartRepository.findById(cartItemId).orElse(null);
        if (cartItem != null && cartItem.getUser().equals(user)) {
            cartRepository.deleteById(cartItemId);
        }
    }
}