package com.umesha_g.store_backend.service;

import java.util.List;

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

        Cart cartItem = new Cart();
        cartItem.setId(idGen.generateId("Cart"));
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(1);

        return cartRepository.save(cartItem);
    }

    public void removeFromCart(HttpServletRequest request, String cartItemId) {
        User user = getUserFromRequest(request);
        if (cartRepository.findById(cartItemId).orElse(null).getUser().equals(user)) {
            cartRepository.deleteById(cartItemId);
        }

    }
}
