package com.umesha_g.the_clique_backend.controller;

import com.umesha_g.the_clique_backend.dto.response.DiscountResponse;
import com.umesha_g.the_clique_backend.dto.response.MiniDiscountResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/discounts")
@RequiredArgsConstructor
public class DiscountController {

    private DiscountService discountService;

    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiscountResponse> getDiscount(@PathVariable String id) throws ResourceNotFoundException {
        return ResponseEntity.ok(discountService.getDiscount(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<MiniDiscountResponse>> getActiveDiscounts() {
        return ResponseEntity.ok(discountService.getActiveDiscounts());
    }

}
