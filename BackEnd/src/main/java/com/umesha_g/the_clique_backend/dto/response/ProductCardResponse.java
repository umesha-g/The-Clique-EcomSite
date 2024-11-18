package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCardResponse {
    private String id;
    private String name;
    private BigDecimal price;
    private Double rating;
    private int reviewCount;
    private String cardImageUrl;
    private Long purchaseCount;
    private Integer stock;
    private MiniDiscountResponse directDiscount;
    private MiniDiscountResponse otherDiscount;
}
