package com.umesha_g.the_clique_backend.dto.request;

import com.umesha_g.the_clique_backend.model.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @PositiveOrZero(message = "Stock must be zero or positive")
    private Integer stock;

    @NotBlank(message = "Description is required")
    private String description;

    private String brandId;

    //@NotNull(message = "Category ID is required")
    private String categoryId;

    private String discountId;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotEmpty(message = "At least one size is required")
    private Set<String> sizes;

    @NotEmpty(message = "At least one color is required")
    private Set<String> colors;
}