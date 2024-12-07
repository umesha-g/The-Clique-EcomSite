package com.umesha_g.the_clique_backend.model.entity.admin;

import com.umesha_g.the_clique_backend.model.entity.Product;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_statistics")
@Data
@NoArgsConstructor
public class ProductStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private LocalDate date;

    private long viewCount;

    private long purchaseCount;

    private BigDecimal revenue;

    private double averageRating;

    private long reviewCount;

//    @ElementCollection
//    @CollectionTable(
//            name = "product_view_history",
//            joinColumns = @JoinColumn(name = "statistics_id")
//    )
//    @MapKeyColumn(name = "view_date")
//    @Column(name = "view_count")
//    private Map<LocalDate, Integer> viewHistory = new HashMap<>();
//
//    @ElementCollection
//    @CollectionTable(
//            name = "product_purchase_history",
//            joinColumns = @JoinColumn(name = "statistics_id")
//    )
//    @MapKeyColumn(name = "purchase_date")
//    @Column(name = "purchase_count")
//    private Map<LocalDate, Integer> purchaseHistory = new HashMap<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
