package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, String> {
    List<Discount> findByIsActiveTrue();
    List<Discount> findByEndDateBeforeAndIsActiveTrue(LocalDate endDate);
    List<Discount> findByStartDateBeforeAndEndDateAfterAndIsActiveFalse(LocalDate startDate, LocalDate endDate);
}