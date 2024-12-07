package com.umesha_g.the_clique_backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class PlatformStatisticsResponse {
    private String id;
    private LocalDate date;
    private long totalOrders;
    private long totalProducts;
    private long activeUsers;
    private BigDecimal totalRevenue;
    private long pendingDisputes;
    private long newRegistrations;
}