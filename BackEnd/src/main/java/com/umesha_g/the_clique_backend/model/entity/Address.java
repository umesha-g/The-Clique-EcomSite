package com.umesha_g.the_clique_backend.model.entity;

import com.umesha_g.the_clique_backend.model.enums.AddressType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "addresses")
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String receiverName;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String addressLine;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String province;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String postalCode;

    private boolean isDefault = false;

    @Enumerated(EnumType.STRING)
    private AddressType addressType;

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

