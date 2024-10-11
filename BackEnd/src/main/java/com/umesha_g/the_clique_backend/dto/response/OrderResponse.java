package com.umesha_g.the_clique_backend.dto.response;

import com.umesha_g.the_clique_backend.model.entity.OrderItem;
import com.umesha_g.the_clique_backend.model.enums.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private String id;
    private List<OrderItem> orderItems;
    private AddressResponse shippingAddress;
    private BigDecimal totalAmount;
    private BigDecimal shippingCost;
    private OrderStatus status;
    private String trackingNumber;
    private LocalDateTime estimatedDeliveryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}