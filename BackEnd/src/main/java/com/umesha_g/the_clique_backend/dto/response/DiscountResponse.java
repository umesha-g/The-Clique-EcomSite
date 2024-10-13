package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class DiscountResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal discountPercentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
   // private Set<CategoryResponse> applicableCategories;
   // private Set<ProductCardResponse> applicableProducts;
    private boolean isActive;
}