package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MiniDiscountResponse {
    private String id;
    private String name;
    private BigDecimal discountPercentage;
    private boolean isActive;
}