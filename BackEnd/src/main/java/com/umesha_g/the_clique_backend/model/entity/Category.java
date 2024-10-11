package com.umesha_g.the_clique_backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "categories")
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @OneToMany(mappedBy = "category")
    private List<Product> products;

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}