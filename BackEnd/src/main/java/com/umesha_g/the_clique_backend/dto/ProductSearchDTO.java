package com.umesha_g.the_clique_backend.dto;

import lombok.Data;

@Data
public class ProductSearchDTO {
    private String query;
    private Double minPrice;
    private Double maxPrice;
    private String category;
    private String brand;
    private String gender;
    private String[] sizes;
    private String[] colors;
    private String sortBy;
    private String sortOrder;
    private Integer page;
    private Integer size;
    private Boolean onlyDiscounted;

}