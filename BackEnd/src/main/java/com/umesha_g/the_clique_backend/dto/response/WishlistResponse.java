package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class WishlistResponse {
    private String id;
    private Set<ProductResponse> products;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}