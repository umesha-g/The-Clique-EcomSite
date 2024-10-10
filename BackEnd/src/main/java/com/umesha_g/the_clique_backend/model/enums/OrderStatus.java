package com.umesha_g.the_clique_backend.model.enums;

public enum OrderStatus {
    PENDING,       // Order has been placed but not yet processed
    CONFIRMED,     // Order has been confirmed by the Admin
    SHIPPED,       // Order has been shipped to the customer
    DELIVERED,     // Order has been delivered to the customer
    CANCELLED,     // Order has been cancelled
    RETURNED,      // Order has been returned by the customer
    REFUNDED,      // Refund has been processed for the order
    FAILED         // Payment or order processing failed
}

