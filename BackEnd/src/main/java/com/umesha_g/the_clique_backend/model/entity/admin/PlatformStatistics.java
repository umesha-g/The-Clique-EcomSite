package com.umesha_g.the_clique_backend.model.entity.admin;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Data
@Table(name = "platform_statistics")
@NoArgsConstructor
public class PlatformStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private LocalDate date;
    private long totalOrders;
    private long totalProducts;
    private long activeUsers;
    private BigDecimal totalRevenue;
    private long pendingDisputes;
    private long newRegistrations;
}