package com.umesha_g.the_clique_backend.model.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import java.util.List;


@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Integer rating;
    private String comment;

    @ElementCollection
    private List<String> imageUrls;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}