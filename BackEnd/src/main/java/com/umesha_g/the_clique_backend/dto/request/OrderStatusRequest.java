package com.umesha_g.the_clique_backend.dto.request;

import com.umesha_g.the_clique_backend.model.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusRequest {
    @NotNull(message = "Order status is required")
    private OrderStatus status;
}