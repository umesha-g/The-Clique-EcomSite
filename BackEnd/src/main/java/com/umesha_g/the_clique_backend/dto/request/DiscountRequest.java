package com.umesha_g.the_clique_backend.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class DiscountRequest {
    private String name;
    private String description;
    private BigDecimal discountPercentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Set<String> applicableCategoryIds;
    private Set<String> applicableProductIds;
    private boolean isActive;
}