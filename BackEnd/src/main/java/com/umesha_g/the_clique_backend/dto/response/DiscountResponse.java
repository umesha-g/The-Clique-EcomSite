package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class DiscountResponse {
    private String id;
    private BigDecimal percentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
}