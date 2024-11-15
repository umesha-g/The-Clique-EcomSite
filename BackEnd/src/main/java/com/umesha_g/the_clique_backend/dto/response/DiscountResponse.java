package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DiscountResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal discountPercentage;
    private LocalDate startDate;
    private LocalDate endDate;
   // private Set<CategoryResponse> applicableCategories;
   // private Set<ProductCardResponse> applicableProducts;
    private boolean isActive;
}