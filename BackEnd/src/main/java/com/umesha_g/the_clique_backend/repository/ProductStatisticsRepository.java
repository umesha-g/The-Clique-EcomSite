package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.admin.ProductStatistics;
import com.umesha_g.the_clique_backend.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductStatisticsRepository extends JpaRepository<ProductStatistics, String> {
    Optional<ProductStatistics> findByProductAndDate(Product product, LocalDate date);

    List<ProductStatistics> findByProductId(String productId);
}