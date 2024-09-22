package com.umesha_g.store_backend.service;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.model.Wishlist;
import com.umesha_g.store_backend.repository.WishlistRepository;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    public void addProductToWishlist(String userId, String productId) {
        Optional<User> user = userService.findById(userId);
        Product product = productService.findById(productId);

        if (user != null && product != null) {
            Wishlist wishlist = wishlistRepository.findByUserId(userId)
                    .orElseGet(() -> createNewWishlist(user));

            if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
                wishlist.addProduct(product);
                wishlistRepository.save(wishlist);
            }
        }
    }

    public void removeProductFromWishlist(String userId, String productId) {
        Optional<Wishlist> wishlistOpt = wishlistRepository.findByUserId(userId);
        Optional<Product> productOpt = Optional.ofNullable(productService.findById(productId));

        if (wishlistOpt.isPresent() && productOpt.isPresent()) {
            Wishlist wishlist = wishlistOpt.get();
            Product product = productOpt.get();
            wishlist.removeProduct(product);
            wishlistRepository.save(wishlist);
        }
    }

    public Set<Product> getWishlistProducts(String userId) {
        return wishlistRepository.findByUserId(userId)
                .map(Wishlist::getProducts)
                .orElse(Collections.emptySet());
    }

    private Wishlist createNewWishlist(Optional<User> user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return wishlistRepository.save(wishlist);
    }

}