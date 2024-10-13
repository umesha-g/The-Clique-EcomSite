package com.umesha_g.the_clique_backend.controller.admin;

import com.umesha_g.the_clique_backend.model.entity.admin.ProductStatistics;
import com.umesha_g.the_clique_backend.repository.ProductStatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/product-statistics")
public class AdminProductStatisticsController {


    private ProductStatisticsRepository productStatisticsRepository;

    public AdminProductStatisticsController(ProductStatisticsRepository productStatisticsRepository) {
        this.productStatisticsRepository = productStatisticsRepository;
    }

    @GetMapping("/{productId}")
    public ResponseEntity<List<ProductStatistics>> getProductStatistics(
            @PathVariable String productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<ProductStatistics> statistics = productStatisticsRepository.findAll();
        return ResponseEntity.ok(statistics);
    }
}
