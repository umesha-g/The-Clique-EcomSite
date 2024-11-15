package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Brand;
import com.umesha_g.the_clique_backend.model.entity.Discount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, String> {
    Optional<Brand> findByName(String name);
    boolean existsByName(String name);
    List<Brand> findByDiscount(Discount discount);
    List<Brand> findByIsActiveTrue();
    Page<Brand> findByNameContainingIgnoreCase(String name, Pageable pageable);
}