package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, String> {
    List<Discount> findByIsActiveTrue();
    List<Discount> findByEndDateAfterAndStartDateBefore(LocalDateTime startDate,LocalDateTime endDate);
    List<Discount> findByApplicableCategoriesId(String categoryId);
}