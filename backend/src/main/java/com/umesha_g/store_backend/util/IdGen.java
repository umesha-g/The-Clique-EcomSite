package com.umesha_g.store_backend.util;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.umesha_g.store_backend.service.AddressService;
import com.umesha_g.store_backend.service.CartService;
import com.umesha_g.store_backend.service.ProductService;
import com.umesha_g.store_backend.service.UserService;
import com.umesha_g.store_backend.service.WishlistService;

@Component
public class IdGen {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private CartService cartService;

    public String generateId(String serviceName) {
        String id;
        do {
            id = UUID.randomUUID().toString();
        } while (idExists(id, serviceName));
        return id;
    }

    private boolean idExists(String id, String serviceName) {
        return switch (serviceName) {
            case "User" -> userService.findUserById(id) != null;
            case "Product" -> productService.findProductById(id) != null;
            case "Address" -> addressService.findAddressById(id) != null;
            case "Wishlist" -> wishlistService.findWishlistById(id) != null;
            case "Cart" -> cartService.findCartItemById(id) != null;
            default -> throw new IllegalArgumentException("Invalid service name: " + serviceName);
        };
    }
}