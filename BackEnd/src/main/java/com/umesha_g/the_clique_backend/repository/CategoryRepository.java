package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Category;
import com.umesha_g.the_clique_backend.model.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
    List<Category> findByDiscount(Discount discount);
}