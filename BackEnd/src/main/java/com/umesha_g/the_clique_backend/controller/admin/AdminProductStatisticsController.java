package com.umesha_g.the_clique_backend.controller.admin;

import com.umesha_g.the_clique_backend.dto.response.ProductStatisticsResponse;
import com.umesha_g.the_clique_backend.service.ProductStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/product-statistics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductStatisticsController {

    private ProductStatisticsService productStatisticsService;

    @Autowired
    public AdminProductStatisticsController( ProductStatisticsService productStatisticsService) {
        this.productStatisticsService = productStatisticsService;
    }

    @GetMapping("/{productId}")
    public ResponseEntity<List<ProductStatisticsResponse>> getProductStatistics(
            @PathVariable String productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<ProductStatisticsResponse> statistics = productStatisticsService.getProductStatisticsByProductIdAndDateRange(productId, startDate, endDate);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/top-performing")
    public ResponseEntity<List<ProductStatisticsResponse>> getTopPerformingProducts(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<ProductStatisticsResponse> topProducts = productStatisticsService.getTopPerformingProducts(limit, startDate, endDate);
        return ResponseEntity.ok(topProducts);
    }

}
