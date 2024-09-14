package com.umesha_g.store_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySeller(User seller);
}