package com.umesha_g.store_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.model.Wishlist;
import com.umesha_g.store_backend.repository.WishlistRepository;
import com.umesha_g.store_backend.util.CookieUtil;
import com.umesha_g.store_backend.util.IdGen;
import com.umesha_g.store_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private IdGen idGen;

    @Autowired
    private CookieUtil cookieUtil;

    @Autowired
    private JwtUtil jwtUtil;

    private User getUserFromRequest(HttpServletRequest request) {
        String token = cookieUtil.getTokenFromCookie(request);
        if (token == null) {
            throw new RuntimeException("Authentication token not found");
        }
        String email = jwtUtil.extractEmail(token);
        return userService.findByEmail(email);
    }

    public Boolean addProductToWishlist(String productId, HttpServletRequest request) {
        User user = getUserFromRequest(request);
        Product product = productService.findById(productId);

        if (user != null && product != null && !wishlistRepository.findByUserAndProduct(user, product).isPresent()) {
            Wishlist wishlist = new Wishlist();
            wishlist.setId(idGen.generateId(8, "Wishlist"));
            wishlist.setUser(user);
            wishlist.setProduct(product);
            wishlistRepository.save(wishlist);
            return true;
        }
        return false;
    }

    public Boolean removeProductFromWishlist(String productId, HttpServletRequest request) {
        User user = getUserFromRequest(request);
        Product product = productService.findById(productId);

        if (user != null && product != null) {
            wishlistRepository.deleteById(wishlistRepository.findByUserAndProduct(user, product).orElse(null).getId());
            return true;
        }
        return false;
    }

    public List<Product> getWishlistProducts(HttpServletRequest request) {
        User user = getUserFromRequest(request);
        if (user != null) {
            return (wishlistRepository.findByUserId(user.getId()).stream()
                    .map(Wishlist::getProduct)
                    .collect(Collectors.toList()));
        }
        return List.of();
    }

    public Wishlist findById(String wishlistId) {
        // User user = getUserFromRequest(request);
        return wishlistRepository.findById(wishlistId).orElse(null);
        // .filter(wishlist -> wishlist.getUser().equals(user))
        // .orElse(null);
    }
}