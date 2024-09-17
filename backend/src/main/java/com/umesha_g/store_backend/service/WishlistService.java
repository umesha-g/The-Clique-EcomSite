package com.umesha_g.store_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.Wishlist;
import com.umesha_g.store_backend.model.WishlistItem;
import com.umesha_g.store_backend.repository.WishlistItemRepository;
import com.umesha_g.store_backend.repository.WishlistRepository;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    public List<Wishlist> getAllWishlists() {
        return wishlistRepository.findAll();
    }

    public Wishlist getWishlistById(Long id) {
        return wishlistRepository.findById(id).orElse(null);
    }

    public Wishlist createWishlist(Wishlist wishlist) {
        wishlist.setCreatedAt(LocalDateTime.now());
        return wishlistRepository.save(wishlist);
    }

    public void addItemToWishlist(Long wishlistId, WishlistItem item) {
        Wishlist wishlist = wishlistRepository.findById(wishlistId).orElse(null);
        if (wishlist != null) {
            item.setWishlist(wishlist);
            wishlistItemRepository.save(item);
        }
    }

    public void removeItemFromWishlist(Long itemId) {
        wishlistItemRepository.deleteById(itemId);
    }

    public void deleteWishlist(Long wishlistId) {
        wishlistRepository.deleteById(wishlistId);
    }
}
