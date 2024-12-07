package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.entity.admin.ProductStatistics;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductStatisticsRepository extends JpaRepository<ProductStatistics, String> {
    Optional<ProductStatistics> findByProductAndDate(Product product, LocalDate date);

    List<ProductStatistics> findByProductId(String productId);

    @Query("SELECT ps FROM ProductStatistics ps " +
            "WHERE ps.date BETWEEN :startDate AND :endDate " +
            "AND ps.product.id = :productId")
    List<ProductStatistics> findByProductIdAndDateRange(
            @Param("productId") String productId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT ps.product FROM ProductStatistics ps " +
            "WHERE ps.date BETWEEN :startDate AND :endDate " +
            "GROUP BY ps.product " +
            "ORDER BY SUM(ps.purchaseCount) DESC")
    List<Product> findBestSellingProducts(LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query("SELECT ps.product FROM ProductStatistics ps " +
            "WHERE ps.date BETWEEN :startDate AND :endDate " +
            "GROUP BY ps.product " +
            "ORDER BY SUM(ps.viewCount) DESC")
    List<Product> findTrendingProducts(LocalDate startDate, LocalDate endDate, Pageable pageable);

    default List<Product> findBestSellingProducts(LocalDate startDate, LocalDate endDate) {
        return findBestSellingProducts(startDate, endDate, PageRequest.of(0, 6));
    }

    default List<Product> findTrendingProducts(LocalDate startDate, LocalDate endDate) {
        return findTrendingProducts(startDate, endDate, PageRequest.of(0, 6));
    }

    List<ProductStatistics> findByProductAndDateBetween(
            Product product,
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("SELECT ps FROM ProductStatistics ps " +
            "WHERE ps.date BETWEEN :startDate AND :endDate " +
            "ORDER BY ps.revenue DESC " +
            "LIMIT :limit")
    List<ProductStatistics> findTopPerformingProducts(
            LocalDate startDate,
            LocalDate endDate,
            int limit
    );

}