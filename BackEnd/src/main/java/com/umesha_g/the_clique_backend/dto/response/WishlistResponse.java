package com.umesha_g.the_clique_backend.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class WishlistResponse {
    private String id;
    private List<ProductCardResponse> products;
}