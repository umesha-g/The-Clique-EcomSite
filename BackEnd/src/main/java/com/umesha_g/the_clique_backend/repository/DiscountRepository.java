package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, String> {
    List<Discount> findByIsActiveTrue();

    @Query("SELECT d FROM Discount d WHERE d.isActive = true AND d.startDate <= :now AND d.endDate >= :now")
    List<Discount> findActiveDiscounts(LocalDateTime now);

    List<Discount> findByApplicableCategories_Id(String categoryId);

    List<Discount> findByApplicableProducts_Id(String productId);
}