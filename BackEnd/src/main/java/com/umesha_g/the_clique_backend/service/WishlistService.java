package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.WishlistResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.model.entity.Wishlist;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import com.umesha_g.the_clique_backend.repository.WishlistRepository;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private  WishlistRepository wishlistRepository;
    private  ProductRepository productRepository;
    private  ModelMapper modelMapper;
    private  SecurityUtils securityUtils;

    @Autowired
    public WishlistService(WishlistRepository wishlistRepository, ProductRepository productRepository, ModelMapper modelMapper, SecurityUtils securityUtils) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
        this.securityUtils = securityUtils;
    }

    @Transactional
    public WishlistResponse addToWishlist(String productId) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if(!wishlist.getProducts().contains(product)){
            wishlist.getProducts().add(product);
        }
        Wishlist updatedWishlist = wishlistRepository.save(wishlist);
        return modelMapper.map(updatedWishlist, WishlistResponse.class);
    }

    @Transactional
    public WishlistResponse removeFromWishlist(String productId) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Wishlist wishlist = getOrCreateWishlist(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        wishlist.getProducts().remove(product);
        Wishlist updatedWishlist = wishlistRepository.save(wishlist);
        return modelMapper.map(updatedWishlist, WishlistResponse.class);
    }

    private Wishlist getOrCreateWishlist(User user) {
        return wishlistRepository.findByUser(user)
                .orElseGet(() -> {
                    Wishlist newWishlist = new Wishlist();
                    newWishlist.setUser(user);
                    return wishlistRepository.save(newWishlist);
                });
    }

    public Wishlist getWishlist() throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        return getOrCreateWishlist(user);
    }
}