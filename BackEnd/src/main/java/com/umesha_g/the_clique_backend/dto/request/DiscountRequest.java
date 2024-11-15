package com.umesha_g.the_clique_backend.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DiscountRequest {
    private String name;
    private String description;
    private BigDecimal discountPercentage;
    private String startDate;
    private String endDate;
   // private Set<String> applicableCategoryIds;
}