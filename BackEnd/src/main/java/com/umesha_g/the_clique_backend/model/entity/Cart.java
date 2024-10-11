package com.umesha_g.the_clique_backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "carts")
@Data
@NoArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();  // Initialize here

    private BigDecimal totalAmount = BigDecimal.ZERO;  // Initialize to zero

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateTotalAmount() {
        this.totalAmount = getCartItems().stream()
                .map(item -> item.getProduct().getPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<CartItem> getCartItems() {
        if (cartItems == null) {
            cartItems = new ArrayList<>();
        }
        return cartItems;
    }
}

