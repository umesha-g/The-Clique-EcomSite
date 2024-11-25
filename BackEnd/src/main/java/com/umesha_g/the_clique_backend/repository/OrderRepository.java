package com.umesha_g.the_clique_backend.repository;

import com.umesha_g.the_clique_backend.model.entity.Order;
import com.umesha_g.the_clique_backend.model.entity.User;
import com.umesha_g.the_clique_backend.model.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Page<Order> findByUser(User user, Pageable pageable);
    boolean existsById(@NotNull String id);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    @Query("SELECT o FROM Order o WHERE o.status = :status " +
            "AND (:id IS NULL OR LOWER(o.id) LIKE LOWER(CONCAT('%', :id, '%')))")
    Page<Order> findByStatusAndSearch(
            @Param("status") OrderStatus status,
            @Param("id") String id,
            Pageable pageable
    );

    Page<Order> findByIdContainingIgnoreCase(String id,Pageable pageable);
}