package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.model.entity.Discount;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DiscountPriorityService {
    private final ProductRepository productRepository;

    @Transactional
    public Product applyHighestPriorityDiscount(Product product) {
        LocalDate now = LocalDate.now();

        if (product.getBrand() != null &&
                product.getBrand().getDiscount() != null &&
                isDiscountValid(product.getBrand().getDiscount(), now)) {
            product.setOtherDiscount(product.getBrand().getDiscount());
        }

        else if (product.getCategory() != null &&
                product.getCategory().getDiscount() != null &&
                isDiscountValid(product.getCategory().getDiscount(), now)) {
            product.setOtherDiscount(product.getCategory().getDiscount());
        }

       return productRepository.save(product);
    }

    private boolean isDiscountValid(Discount discount, LocalDate now) {
        return discount.isActive() &&
                now.isAfter(discount.getStartDate()) &&
                now.isBefore(discount.getEndDate());
    }
}