package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.CartResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.*;
import com.umesha_g.the_clique_backend.repository.CartItemRepository;
import com.umesha_g.the_clique_backend.repository.CartRepository;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import com.umesha_g.the_clique_backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
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

    @Transactional
    public CartResponse addToCart(String productId, Integer quantity) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem existingItem = findCartItem(cart, productId);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setSubTotal(calDiscountedPrice(product).multiply(new BigDecimal(existingItem.getQuantity())));
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setSubTotal(calDiscountedPrice(product).multiply(new BigDecimal(quantity)));
            cart.getCartItems().add(newItem);
        }

        product.setStock((product.getStock() - quantity));
        System.out.println( "product is" + product.getStock());
        productRepository.save(product);

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
            item.setSubTotal(calDiscountedPrice(item.getProduct()).multiply(new BigDecimal(item.getQuantity())));
        }

        cart.updateTotalAmount();
        Cart updatedCart = cartRepository.save(cart);
        return modelMapper.map(updatedCart, CartResponse.class);
    }

    @Transactional
    public CartResponse incrementQuantity(String productId) throws ResourceNotFoundException {
        CartItem item = getCartItem(productId);

        Product product = item.getProduct();
        product.setStock(product.getStock()  - 1);
        productRepository.save(product);

        return updateQuantity(productId, item.getQuantity() + 1);
    }

    @Transactional
    public CartResponse decrementQuantity(String productId) throws ResourceNotFoundException {
        CartItem item = getCartItem(productId);

        Product product = item.getProduct();
        product.setStock(product.getStock() + 1);
        productRepository.save(product);

        return updateQuantity(productId, item.getQuantity() - 1);
    }

    @Transactional
    public CartResponse removeFromCart(String productId) throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem item = findCartItem(cart, productId);
        if (item == null) {
            throw new ResourceNotFoundException("Product not found in cart");
        }

        Product product = item.getProduct();
        product.setStock((product.getStock() + item.getQuantity()));
        productRepository.save(product);

        cart.getCartItems().remove(item);
        cart.updateTotalAmount();
        Cart updatedCart = cartRepository.save(cart);
        return modelMapper.map(updatedCart, CartResponse.class);
    }

    public void clearCart() throws ResourceNotFoundException {
        User user = securityUtils.getCurrentUser();
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cartRepository.save(cart);
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

    private BigDecimal calDiscountedPrice(Product product) {
        Discount activeDiscount = null;
        if (product.getDirectDiscount() != null) {
            activeDiscount = product.getDirectDiscount();
        } else if (product.getOtherDiscount() != null) {
            activeDiscount = product.getOtherDiscount();
        }

        BigDecimal DiscountedPrice = product.getPrice();
        if (activeDiscount != null) {
            DiscountedPrice = product.getPrice().subtract(product.getPrice().multiply(activeDiscount.getDiscountPercentage().divide(BigDecimal.valueOf(100))));
        }

        return DiscountedPrice;
    }
}