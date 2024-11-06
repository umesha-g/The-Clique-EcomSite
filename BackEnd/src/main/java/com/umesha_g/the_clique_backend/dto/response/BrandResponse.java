package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

@Data
public class BrandResponse {
    private String id;
    private String name;
    private String description;
    private MiniDiscountResponse discount;
    private String logoUrl;
    // private List<ProductResponse> products;
    private boolean isActive;
}
