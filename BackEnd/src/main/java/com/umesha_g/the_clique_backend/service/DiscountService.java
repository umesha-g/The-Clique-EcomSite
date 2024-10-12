package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.request.DiscountRequest;
import com.umesha_g.the_clique_backend.dto.response.DiscountResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Category;
import com.umesha_g.the_clique_backend.model.entity.Discount;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.repository.CategoryRepository;
import com.umesha_g.the_clique_backend.repository.DiscountRepository;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountService {
    private final DiscountRepository discountRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public DiscountResponse createDiscount(DiscountRequest request) {
        Discount discount = modelMapper.map(request, Discount.class);

        discountProcess(request, discount);

        Discount savedDiscount = discountRepository.save(discount);
        return modelMapper.map(savedDiscount, DiscountResponse.class);
    }

    public DiscountResponse getDiscount(String id) throws ResourceNotFoundException {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount", "id", id));
        return modelMapper.map(discount, DiscountResponse.class);
    }

    public List<DiscountResponse> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(discount -> modelMapper.map(discount, DiscountResponse.class))
                .collect(Collectors.toList());
    }

    public List<DiscountResponse> getActiveDiscounts() {
        return discountRepository.findActiveDiscounts(LocalDateTime.now()).stream()
                .map(discount -> modelMapper.map(discount, DiscountResponse.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public DiscountResponse updateDiscount(String id, DiscountRequest request) throws ResourceNotFoundException {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Discount", "id", id));

        modelMapper.map(request, discount);

        discountProcess(request, discount);

        Discount updatedDiscount = discountRepository.save(discount);
        return modelMapper.map(updatedDiscount, DiscountResponse.class);
    }

    @Transactional
    public void deleteDiscount(String id) throws ResourceNotFoundException {
        if (!discountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Discount", "id", id);
        }
        discountRepository.deleteById(id);
    }

    private void discountProcess(DiscountRequest request, Discount discount) {
        Set<Category> categories = request.getApplicableCategoryIds().stream()
                .map(id -> {
                    try {
                        return categoryRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
                    } catch (ResourceNotFoundException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toSet());

        Set<Product> products = request.getApplicableProductIds().stream()
                .map(id -> {
                    try {
                        return productRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
                    } catch (ResourceNotFoundException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toSet());

        discount.setApplicableCategories(categories);
        discount.setApplicableProducts(products);
    }
}