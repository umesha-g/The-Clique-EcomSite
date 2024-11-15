package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartResponse {
    private String id;
    private List<CartItemResponse> cartItems;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
}