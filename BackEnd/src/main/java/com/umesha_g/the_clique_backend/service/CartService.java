package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.CartResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Cart;
import com.umesha_g.the_clique_backend.model.entity.CartItem;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.repository.CartItemRepository;
import com.umesha_g.the_clique_backend.repository.CartRepository;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {
    private  CartRepository cartRepository;
    private  CartItemRepository cartItemRepository;
    private  ProductRepository productRepository;
    private  ModelMapper modelMapper;
    private  SecurityUtils securityUtils;

    @Autowired
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, ModelMapper modelMapper, SecurityUtils securityUtils) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
        this.securityUtils = securityUtils;
    }

    public Cart getCart() throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        return getOrCreateCart(user);
    }

    public CartResponse addToCart(String productId, Integer quantity) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem existingItem = findCartItem(cart, productId);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getCartItems().add(newItem);
        }

        cart.updateTotalAmount();
        Cart updatedCart = cartRepository.save(cart);
        return modelMapper.map(updatedCart, CartResponse.class);
    }

    public CartResponse updateQuantity(String productId, Integer quantity) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem item = findCartItem(cart, productId);
        if (item == null) {
            throw new ResourceNotFoundException("Product not found in cart");
        }

        if (quantity <= 0) {
            cart.getCartItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }

        cart.updateTotalAmount();
        Cart updatedCart = cartRepository.save(cart);
        return modelMapper.map(updatedCart, CartResponse.class);
    }

    public CartResponse incrementQuantity(String productId) throws ResourceNotFoundException {
        CartItem item = getCartItem(productId);
        return updateQuantity(productId, item.getQuantity() + 1);
    }

    public CartResponse decrementQuantity(String productId) throws ResourceNotFoundException {
        CartItem item = getCartItem(productId);
        return updateQuantity(productId, item.getQuantity() - 1);
    }

    public CartResponse removeFromCart(String productId) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem item = findCartItem(cart, productId);
        if (item == null) {
            throw new ResourceNotFoundException("Product not found in cart");
        }
        cart.getCartItems().remove(item);
        cart.updateTotalAmount();
        Cart updatedCart = cartRepository.save(cart);
        return modelMapper.map(updatedCart, CartResponse.class);
    }

    public void clearCart() throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);
    }

    private CartItem getCartItem(String productId) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        CartItem item = findCartItem(cart, productId);
        if (item == null) {
            throw new ResourceNotFoundException("Product not found in cart");
        }
        return item;
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private CartItem findCartItem(Cart cart, String productId) {
        return cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);
    }
}