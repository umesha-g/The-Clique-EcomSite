package com.umesha_g.the_clique_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BrandRequest {
    @NotBlank(message = "Brand name is required")
    private String name;

    private String description;
    private MultipartFile logoFile;
    private String discountId;
    private String existingLogoUrl;
}