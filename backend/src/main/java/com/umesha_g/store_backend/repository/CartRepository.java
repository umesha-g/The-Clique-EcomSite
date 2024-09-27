package com.umesha_g.store_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.umesha_g.store_backend.model.Cart;
import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;

public interface CartRepository extends JpaRepository<Cart, String> {
    List<Cart> findByUser(User user);

    Optional<Cart> findByUserAndProduct(User user, Product product);
}
