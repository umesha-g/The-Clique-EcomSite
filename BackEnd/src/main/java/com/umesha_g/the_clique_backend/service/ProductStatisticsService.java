package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.ProductCardResponse;
import com.umesha_g.the_clique_backend.dto.response.ProductStatisticsResponse;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.model.entity.Review;
import com.umesha_g.the_clique_backend.model.entity.admin.ProductStatistics;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import com.umesha_g.the_clique_backend.repository.ProductStatisticsRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductStatisticsService {

    private ProductStatisticsRepository productStatisticsRepository;
    private ModelMapper modelMapper;
    private ProductRepository productRepository;

    @Autowired
    public ProductStatisticsService(ProductStatisticsRepository productStatisticsRepository, ModelMapper modelMapper, ProductRepository productRepository) {
        this.productStatisticsRepository = productStatisticsRepository;
        this.modelMapper = modelMapper;
        this.productRepository = productRepository;
    }

    @Transactional
    public void incrementViewCount(Product product) {
        updateProductStatistics(product, stats -> {
            stats.setViewCount(stats.getViewCount() + 1);
            //stats.getViewHistory().merge(LocalDate.now(), 1, Integer::sum);
        });
    }

    @Transactional
    public void incrementPurchaseCount(Product product,int quantity, BigDecimal price) {
        updateProductStatistics(product, stats -> {
            stats.setPurchaseCount(stats.getPurchaseCount() + quantity);
           // stats.getPurchaseHistory().merge(LocalDate.now(), 1, Integer::sum);
            stats.setRevenue(stats.getRevenue().add(price));
        });
    }

    @Transactional
    public void updateRating(Product product, Review review) {
        updateProductStatistics(product, stats -> {
            long newReviewCount = stats.getReviewCount() + 1;
            double newTotalRating = (stats.getAverageRating() * stats.getReviewCount()) + review.getRating();
            double newAverageRating = newTotalRating / newReviewCount;

            stats.setReviewCount(newReviewCount);
            stats.setAverageRating(newAverageRating);
        });
    }

    public List<ProductCardResponse> getBestSellingProducts() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        return productStatisticsRepository.findBestSellingProducts(startDate, endDate).stream()
                .map(product -> modelMapper.map(product, ProductCardResponse.class))
                .collect(Collectors.toList());
    }

    public List<ProductCardResponse> getTrendingProducts() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        return productStatisticsRepository.findTrendingProducts(startDate, endDate).stream()
                .map(product -> modelMapper.map(product, ProductCardResponse.class))
                .collect(Collectors.toList());
    }

    // best-selling products with a custom date range
    public List<ProductCardResponse> getBestSellingProducts(LocalDate startDate, LocalDate endDate) {
        return productStatisticsRepository.findBestSellingProducts(startDate, endDate).stream()
                .map(product -> modelMapper.map(product, ProductCardResponse.class))
                .collect(Collectors.toList());
    }

    // trending products with a custom date range
    public List<ProductCardResponse> getTrendingProducts(LocalDate startDate, LocalDate endDate) {
        return productStatisticsRepository.findTrendingProducts(startDate, endDate).stream()
                .map(product -> modelMapper.map(product, ProductCardResponse.class))
                .collect(Collectors.toList());
    }

    public List<ProductStatisticsResponse> getProductStatisticsByProductIdAndDateRange(
            String productId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        List<ProductStatistics> statistics = productStatisticsRepository
                .findByProductAndDateBetween(product, startDate, endDate);

        return statistics.stream()
                .map(productStatistics -> modelMapper.map(productStatistics, ProductStatisticsResponse.class))
                .collect(Collectors.toList());
    }

    public List<ProductStatisticsResponse> getTopPerformingProducts(
            int limit,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<ProductStatistics> topProducts = productStatisticsRepository
                .findTopPerformingProducts(startDate, endDate, limit);

        return topProducts.stream()
                .map(productStatistics -> modelMapper.map(productStatistics, ProductStatisticsResponse.class))
                .collect(Collectors.toList());
    }

    private void updateProductStatistics(Product product, StatisticsUpdater updater) {
        ProductStatistics stats = productStatisticsRepository
                .findByProductAndDate(product, LocalDate.now())
                .orElseGet(() -> createNewProductStatistics(product));

        updater.update(stats);
        productStatisticsRepository.save(stats);

        long newViewCount = 0;
        long newPurchaseCount = 0;
        long newReviewCount = 0;

        List<ProductStatistics> statsByProduct = productStatisticsRepository.findByProductId(product.getId());
        for(ProductStatistics stat : statsByProduct ) {
            newViewCount += stat.getViewCount();
            newPurchaseCount += stat.getPurchaseCount();
            newReviewCount += stat.getReviewCount();
        }

        product.setViewCount(newViewCount);
        product.setPurchaseCount(newPurchaseCount);
        product.setReviewCount(newReviewCount);
        productRepository.save(product);
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