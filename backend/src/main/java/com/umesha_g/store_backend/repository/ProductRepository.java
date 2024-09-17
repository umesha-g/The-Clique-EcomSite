package com.umesha_g.store_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySeller(User seller);

    // Search for products by name (case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Get top 5 search suggestions by name (case-insensitive)
    List<Product> findTop5ByNameContainingIgnoreCase(String name);

}