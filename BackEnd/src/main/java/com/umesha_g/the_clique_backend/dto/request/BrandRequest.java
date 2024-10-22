package com.umesha_g.the_clique_backend.dto.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BrandRequest {
    @NotBlank(message = "Brand name is required")
    private String name;

    private String description;

    private MultipartFile logoFile;

    private boolean isActive = true;
}