package com.umesha_g.the_clique_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class BrandRequest {
    @NotBlank(message = "Brand name is required")
    private String name;

    private String description;

    @NotBlank(message = "Logo URL is required")
    @URL(message = "Invalid logo URL format")
    private String logoUrl;

    private boolean isActive = true;
}