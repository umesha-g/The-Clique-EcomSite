package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class BrandResponse {
    private String id;

    private String name;

    private String description;

    private String logoUrl;

    private List<ProductResponse> products;

    private boolean isActive;
}
