package com.umesha_g.store_backend.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.Wishlist;
import com.umesha_g.store_backend.repository.WishlistRepository;
import com.umesha_g.store_backend.util.IdGen;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private IdGen idGen;

    public void addProductToWishlist(String userId, String productId) {
        if (!wishlistRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
            Wishlist wishlist = new Wishlist();
            wishlist.setId(idGen.generateId(8, "Wishlist"));
            wishlist.setUserId(userId);
            wishlist.setProductId(productId);
            wishlistRepository.save(wishlist);
        }
    }

    public void removeProductFromWishlist(String userId, String productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public Set<Product> getWishlistProducts(String userId) {
        List<Wishlist> wishlistItems = wishlistRepository.findByUserId(userId);
        return wishlistItems.stream()
                .map(item -> productService.findById(item.getProductId()))
                .collect(Collectors.toSet());
    }

    // New method to find a wishlist item by its id
    public Wishlist findById(String id) {
        return wishlistRepository.findById(id).orElse(null);
    }
}