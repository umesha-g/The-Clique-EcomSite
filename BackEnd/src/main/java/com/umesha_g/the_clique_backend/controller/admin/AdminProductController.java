package com.umesha_g.the_clique_backend.controller.admin;

import com.umesha_g.the_clique_backend.dto.request.ProductRequest;
import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.FileReference;
import com.umesha_g.the_clique_backend.service.ProductImageService;
import com.umesha_g.the_clique_backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/products")
//@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminProductController {
    private ProductService productService;
    private ProductImageService productImageService;

    @Autowired
    public AdminProductController(ProductService productService, ProductImageService productImageService) {
        this.productService = productService;
        this.productImageService = productImageService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) throws ResourceNotFoundException {
        return new ResponseEntity<>(productService.createProduct(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductRequest request) throws ResourceNotFoundException {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) throws ResourceNotFoundException {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{productId}/images")
    public ResponseEntity<?> uploadProductImage(
            @PathVariable String productId,
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean isCardImage) {
        try {
            productImageService.addProductImage(productId,file,isCardImage);
            return ResponseEntity.ok("Product Image Uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{productId}/images")
    public ResponseEntity<List<FileReference>> getProductImages(
            @PathVariable String productId) {
        List<FileReference> files =  productImageService.getProductImages(productId);
        return ResponseEntity.ok(files);
    }

    @DeleteMapping("/{productId}/images/{fileId}")
    public ResponseEntity<?> deleteProductImage(
            @PathVariable String productId,
            @PathVariable String fileId) {
        try {
            productImageService.removeProductImage(productId,fileId);
            return ResponseEntity.ok("Image deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body( e.getMessage());
        }
    }

    @PutMapping("/products/{productId}/images/{fileId}/set-as-card")
    public ResponseEntity<?> setAsCardImage(@PathVariable String productId,@PathVariable String fileId) {
        try {
            productImageService.setAsCardImage(productId,fileId);
            return ResponseEntity.ok("Image set as card image successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}