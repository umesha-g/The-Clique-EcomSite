package com.umesha_g.the_clique_backend.dto.request;

import lombok.Data;

@Data
public class CartRequest {
    private String productId;
    private Integer quantity;
}