package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findByProductId(String productId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double calculateAverageRating(String productId);

    Page<Review> findByUserId(String userId, Pageable pageable);
}