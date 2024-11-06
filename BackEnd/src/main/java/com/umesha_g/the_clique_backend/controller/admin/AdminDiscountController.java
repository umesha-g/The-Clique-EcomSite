package com.umesha_g.the_clique_backend.controller.admin;

import com.umesha_g.the_clique_backend.dto.request.DiscountRequest;
import com.umesha_g.the_clique_backend.dto.response.DiscountResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.DiscountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/discounts")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDiscountController {
    private DiscountService discountService;

    @Autowired
    public AdminDiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @PostMapping
    public ResponseEntity<DiscountResponse> createDiscount(@Valid @RequestBody DiscountRequest request) {
        return new ResponseEntity<>(discountService.createDiscount(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DiscountResponse>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

//    @GetMapping("/active")
//    public ResponseEntity<List<DiscountResponse>> getActiveDiscounts() {
//        return ResponseEntity.ok(discountService.getActiveDiscounts());
//    }

    @PutMapping("/{id}")
    public ResponseEntity<DiscountResponse> updateDiscount(
            @PathVariable String id,
            @Valid @RequestBody DiscountRequest request) throws ResourceNotFoundException {
        return ResponseEntity.ok(discountService.updateDiscount(id, request));
    }

    @PutMapping("state/{id}/{state}")
    public ResponseEntity<DiscountResponse> updateDiscountState(
            @PathVariable String id,
            @PathVariable Boolean state) throws ResourceNotFoundException {
        return ResponseEntity.ok(discountService.setDiscountState(id, state));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable String id) throws ResourceNotFoundException {
        discountService.deleteDiscount(id);
        return ResponseEntity.noContent().build();
    }
}

