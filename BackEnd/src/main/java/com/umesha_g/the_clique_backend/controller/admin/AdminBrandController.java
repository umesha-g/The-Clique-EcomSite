package com.umesha_g.the_clique_backend.controller.admin;

import com.umesha_g.the_clique_backend.dto.request.BrandRequest;
import com.umesha_g.the_clique_backend.dto.response.BrandResponse;
import com.umesha_g.the_clique_backend.service.BrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/brands")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminBrandController {

    private BrandService brandService;

    @Autowired
    public AdminBrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @PostMapping
    public ResponseEntity<BrandResponse> createBrand(@Valid @ModelAttribute BrandRequest brandRequest) {
        BrandResponse createdBrand = brandService.createBrand(brandRequest);
        return new ResponseEntity<>(createdBrand, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BrandResponse> updateBrand(@PathVariable String id, @Valid @ModelAttribute BrandRequest brandRequest) {
        BrandResponse updatedBrand = brandService.updateBrand(id, brandRequest);
        return ResponseEntity.ok(updatedBrand);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable String id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }
}