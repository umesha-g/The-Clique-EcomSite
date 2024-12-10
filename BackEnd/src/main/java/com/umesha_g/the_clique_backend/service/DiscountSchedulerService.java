package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.model.entity.Discount;
import com.umesha_g.the_clique_backend.repository.BrandRepository;
import com.umesha_g.the_clique_backend.repository.CategoryRepository;
import com.umesha_g.the_clique_backend.repository.DiscountRepository;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscountSchedulerService {
    private final DiscountRepository discountRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Scheduled(cron = "0 0 * * * *") // Run every hour
    @Transactional
    public void checkAndUpdateExpiredDiscounts() {
        LocalDate now = LocalDate.now();
        List<Discount> expiredDiscounts = discountRepository.findByEndDateBeforeAndIsActiveTrue(now);

        for (Discount discount : expiredDiscounts) {
            // Deactivate discount
            discount.setActive(false);
            discountRepository.save(discount);

            // Remove expired discount from all related entities
            productRepository.findByDirectDiscount(discount)
                    .forEach(product -> {
                        product.setDirectDiscount(null);
                        productRepository.save(product);
                    });

            productRepository.findByOtherDiscount(discount)
                    .forEach(product -> {
                        product.setOtherDiscount(null);
                        productRepository.save(product);
                    });

            categoryRepository.findByDiscount(discount)
                    .forEach(category -> {
                        category.setDiscount(null);
                        categoryRepository.save(category);
                    });

            brandRepository.findByDiscount(discount)
                    .forEach(brand -> {
                        brand.setDiscount(null);
                        brandRepository.save(brand);
                    });
        }
    }

//    @Scheduled(cron = "0 0 * * * *") // Run every hour
//    @Transactional
//    public void checkAndUpdateNewDiscounts() {
//        LocalDate now = LocalDate.now();
//        List<Discount> expiredDiscounts = discountRepository.findByStartDateBeforeAndEndDateAfterAndIsActiveFalse(now,now);
//
//        for (Discount discount : expiredDiscounts) {
//            // Activate discount
//            discount.setActive(true);
//            discountRepository.save(discount);
//
//            productRepository.findByOtherDiscount(discount)
//                    .forEach(product -> {
//                        product.setOtherDiscount(null);
//                        productRepository.save(product);
//                    });
//        }
//    }
}