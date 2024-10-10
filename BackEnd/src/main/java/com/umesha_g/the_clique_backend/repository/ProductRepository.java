package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Brand;
import com.umesha_g.the_clique_backend.model.entity.Category;
import com.umesha_g.the_clique_backend.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Page<Product> findByCategory(Category category, Pageable pageable);
    Page<Product> findByBrand(Brand brand, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Product> findByStockLessThan(int threshold);
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:brandId IS NULL OR p.brand.id = :brandId) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:gender IS NULL OR p.gender = :gender) AND " +
            "(:searchTerm IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Product> findWithFilters(
            String categoryId,
            String brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String gender,
            String searchTerm,
            Pageable pageable
    );

    @Query("""
        SELECT p FROM Product p 
        WHERE p.category.id = :categoryId 
        AND p.id != :productId 
        AND p.price BETWEEN :minPrice AND :maxPrice
        ORDER BY p.rating DESC
        """)
        List<Product> findRelatedProducts(
                @Param("categoryId") String categoryId,
                @Param("productId") String productId,
                @Param("minPrice") double minPrice,
                @Param("maxPrice") double maxPrice,
                Pageable pageable
        );

        @Query("""
        SELECT p FROM Product p 
        WHERE p.category.id IN :categories 
        OR p.brand.id IN :brands
        ORDER BY p.rating DESC, p.viewCount DESC
        """)
        List<Product> findRecommendedProducts(
                @Param("categories") Set<String> categories,
                @Param("brands") Set<String> brands,
                Pageable pageable
        );
    }
}