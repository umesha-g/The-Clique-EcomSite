package com.umesha_g.the_clique_backend.dto.request;

import com.umesha_g.the_clique_backend.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderRequest {
    private String id;

    private BigDecimal shippingCost;

    @NotNull(message = "Shipping address ID is required")
    private String addressId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    //private String couponCode;
}