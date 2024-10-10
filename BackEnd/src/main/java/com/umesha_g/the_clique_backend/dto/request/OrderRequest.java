package com.umesha_g.the_clique_backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotNull(message = "Shipping address ID is required")
    private String addressId;

   // @NotNull(message = "Payment method is required")
    //private PaymentMethod paymentMethod;

    //private String couponCode;
}