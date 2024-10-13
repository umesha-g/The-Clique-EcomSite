package com.umesha_g.the_clique_backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.umesha_g.the_clique_backend.model.enums.Gender;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class ProductResponse {
    private String id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private Double rating;
    private String description;
    private String brandName;
    private String categoryName;
    private List<String> detailImageUrls;
    private String cardImageUrl;
    private Gender gender;
    private Set<String> sizes;
    private Set<String> colors;
    //private Long viewCount;
    private Long purchaseCount;
    private LocalDateTime createdAt;
    //private LocalDateTime updatedAt;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private DiscountResponse activeDiscount;
}