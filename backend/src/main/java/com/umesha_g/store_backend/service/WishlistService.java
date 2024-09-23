package com.umesha_g.store_backend.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.model.Wishlist;
import com.umesha_g.store_backend.repository.WishlistRepository;
import com.umesha_g.store_backend.util.IdGen;

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

    public void addProductToWishlist(String userId, String productId) {
        User user = userService.findById(userId);
        Product product = productService.findById(productId);

        if (user != null && product != null && !wishlistRepository.findByUserAndProduct(user, product).isPresent()) {
            Wishlist wishlist = new Wishlist();
            wishlist.setId(idGen.generateId(8, "Wishlist"));
            wishlist.setUser(user);
            wishlist.setProduct(product);
            wishlistRepository.save(wishlist);
        }
    }

    public void removeProductFromWishlist(String userId, String productId) {
        User user = userService.findById(userId);
        Product product = productService.findById(productId);

        if (user != null && product != null) {
            wishlistRepository.deleteByUserAndProduct(user, product);
        }
    }

    public Set<Product> getWishlistProducts(String userId) {
        User user = userService.findById(userId);
        if (user != null) {
            return user.getWishlistItems().stream()
                    .map(Wishlist::getProduct)
                    .collect(Collectors.toSet());
        }
        return Set.of();
    }

    public Wishlist findById(String id) {
        return wishlistRepository.findById(id).orElse(null);
    }
}