package com.umesha_g.store_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.umesha_g.store_backend.model.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, String> {

    List<Wishlist> findByUserId(String userId);

    Optional<Wishlist> findByUserIdAndProductId(String userId, String productId);

    void deleteByUserIdAndProductId(String userId, String productId);
}