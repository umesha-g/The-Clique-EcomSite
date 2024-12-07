package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Brand;
import com.umesha_g.the_clique_backend.model.entity.Category;
import com.umesha_g.the_clique_backend.model.entity.Discount;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.enums.Gender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Page<Product> findByCategory(Category category, Pageable pageable);
    List<Product> findByDirectDiscount(Discount discount);
    List<Product> findByOtherDiscount(Discount discount);
    Page<Product> findByBrand(Brand brand, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Product> findByBrand(Brand brand);
    List<Product> findByCategory(Category category);
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
            Gender gender,
            String searchTerm,
            Pageable pageable
    );

    @Query("SELECT new org.springframework.data.util.Pair(MIN(p.price), MAX(p.price)) FROM Product p")
    Pair<BigDecimal, BigDecimal> findPriceRange();

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.id <> :currentProductId ORDER BY FUNCTION('RAND')")
    List<Product> findRelatedProductsByCategoryRandomly(
            @Param("categoryId") String categoryId,
            @Param("currentProductId") String currentProductId,
            Pageable pageable
    );

    @Query("SELECT p.name FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY p.purchaseCount DESC")
    List<String> findTop5ProductNameSuggestions(@Param("searchTerm") String searchTerm);

    @Query("SELECT p FROM Product p " +
            "WHERE (:minDirectDiscount IS NULL OR p.directDiscount.discountPercentage >= :minDirectDiscount) " +
            "AND (:maxDirectDiscount IS NULL OR p.directDiscount.discountPercentage <= :maxDirectDiscount) " +
            "AND (:minOtherDiscount IS NULL OR p.otherDiscount.discountPercentage >= :minOtherDiscount) " +
            "AND (:maxOtherDiscount IS NULL OR p.otherDiscount.discountPercentage <= :maxOtherDiscount)")
    Page<Product> findProductsByDiscountRange(
            @Param("minDirectDiscount") Double minDirectDiscount,
            @Param("maxDirectDiscount") Double maxDirectDiscount,
            @Param("minOtherDiscount") Double minOtherDiscount,
            @Param("maxOtherDiscount") Double maxOtherDiscount,
            Pageable pageable
    );
}