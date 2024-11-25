package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ProductStatisticsResponse {
    private String id;
    private String productId;
    private LocalDate date;
    private long viewCount;
    private long purchaseCount;
    private BigDecimal revenue;
    private double averageRating;
    private long reviewCount;
    private Map<LocalDate, Integer> viewHistory;
    private Map<LocalDate, Integer> purchaseHistory;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}