package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private String id;
    private ProductCardResponse product;
    private Integer quantity;
    private BigDecimal subTotal;
}