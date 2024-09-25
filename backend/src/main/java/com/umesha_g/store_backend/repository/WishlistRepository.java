package com.umesha_g.store_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.model.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, String> {

    List<Wishlist> findByUserId(String uerId);

    Optional<Wishlist> findByUserAndProduct(User user, Product product);

    // void deleteByUser_IdAndProduct_Id(String userId, String productId);
}