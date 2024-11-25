package com.umesha_g.the_clique_backend.dto.response;

import com.umesha_g.the_clique_backend.model.enums.OrderStatus;
import com.umesha_g.the_clique_backend.model.enums.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private String id;
    private List<OrderItemResponse> orderItems;
    private AddressResponse shippingAddress;
    private BigDecimal subTotal;
    private BigDecimal totalAmount;
    private BigDecimal shippingCost;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private LocalDate estimatedDeliveryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}