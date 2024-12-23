package com.umesha_g.the_clique_backend.model.entity;

import com.umesha_g.the_clique_backend.model.enums.Gender;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    private BigDecimal price;
    private Integer stock;
    private Double rating;
    private long reviewCount;
    private String description;
    private long viewCount = 0L;
    private long purchaseCount = 0L;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "direct_discount_id")
    private Discount directDiscount;

    @ManyToOne
    @JoinColumn(name = "other_discount_id")
    private Discount otherDiscount;

    @ElementCollection
    private List<String> detailImageUrls;

    private String CardImageUrl;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ElementCollection
    private Set<String> sizes;

    @ElementCollection
    private Set<String> colors;

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