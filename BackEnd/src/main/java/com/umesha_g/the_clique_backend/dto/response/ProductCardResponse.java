package com.umesha_g.the_clique_backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCardResponse {
    private String id;
    private String name;
    private BigDecimal price;
    private Double rating;
    private String cardImageUrl;
    private Long purchaseCount;
    private Integer stock;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private DiscountResponse activeDiscount;
}
