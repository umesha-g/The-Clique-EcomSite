package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, String> {
    List<Discount> findByIsActiveTrue();

    // List<Discount> findByApplicableCategories_Id(String categoryId);

   // List<Discount> findByApplicableProducts_Id(String productId);
}