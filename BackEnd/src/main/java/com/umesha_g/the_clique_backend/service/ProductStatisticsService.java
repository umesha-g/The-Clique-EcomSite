package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.entity.Review;
import com.umesha_g.the_clique_backend.model.entity.admin.ProductStatistics;
import com.umesha_g.the_clique_backend.repository.ProductStatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ProductStatisticsService {

    private ProductStatisticsRepository productStatisticsRepository;

    @Autowired
    public ProductStatisticsService(ProductStatisticsRepository productStatisticsRepository) {
        this.productStatisticsRepository = productStatisticsRepository;
    }

    public void incrementViewCount(Product product) {
        updateProductStatistics(product, stats -> {
            stats.setViewCount(stats.getViewCount() + 1);
            stats.getViewHistory().merge(LocalDate.now(), 1, Integer::sum);
        });
    }

    public void incrementPurchaseCount(Product product,int quantity, BigDecimal price) {
        updateProductStatistics(product, stats -> {
            stats.setPurchaseCount(stats.getPurchaseCount() + quantity);
            stats.getPurchaseHistory().merge(LocalDate.now(), 1, Integer::sum);
            stats.setRevenue(stats.getRevenue().add(price));
        });
    }

    public void updateRating(Product product, Review review) {
        updateProductStatistics(product, stats -> {
            long newReviewCount = stats.getReviewCount() + 1;
            double newTotalRating = (stats.getAverageRating() * stats.getReviewCount()) + review.getRating();
            double newAverageRating = newTotalRating / newReviewCount;

            stats.setReviewCount(newReviewCount);
            stats.setAverageRating(newAverageRating);
        });
    }

    private void updateProductStatistics(Product product, StatisticsUpdater updater) {
        ProductStatistics stats = productStatisticsRepository
                .findByProductAndDate(product, LocalDate.now())
                .orElseGet(() -> createNewProductStatistics(product));

        updater.update(stats);
        productStatisticsRepository.save(stats);
    }

    private ProductStatistics createNewProductStatistics(Product product) {
        ProductStatistics stats = new ProductStatistics();
        stats.setProduct(product);
        stats.setDate(LocalDate.now());
        stats.setViewCount(0);
        stats.setPurchaseCount(0);
        stats.setRevenue(BigDecimal.ZERO);
        stats.setAverageRating(0.0);
        stats.setReviewCount(0);
        return stats;
    }

    @FunctionalInterface
    private interface StatisticsUpdater {
        void update(ProductStatistics stats);
    }
}