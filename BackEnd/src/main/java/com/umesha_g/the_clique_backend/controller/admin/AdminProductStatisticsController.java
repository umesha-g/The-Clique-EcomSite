package com.umesha_g.the_clique_backend.controller.admin;

import com.umesha_g.the_clique_backend.model.entity.admin.ProductStatistics;
import com.umesha_g.the_clique_backend.repository.ProductStatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            @PathVariable String productId){
        List<ProductStatistics> statistics = productStatisticsRepository.findByProductId(productId);
        return ResponseEntity.ok(statistics);
    }
}
