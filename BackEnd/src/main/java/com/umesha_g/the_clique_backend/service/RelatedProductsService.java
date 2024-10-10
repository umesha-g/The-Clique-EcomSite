package com.umesha_g.the_clique_backend.service;

import com.umesha_g.the_clique_backend.dto.response.ProductResponse;
import com.umesha_g.the_clique_backend.exception.ResourceNotFoundException;
import com.umesha_g.the_clique_backend.model.entity.Product;
import com.umesha_g.the_clique_backend.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;


import java.util.Set;

import java.util.stream.Collectors;

@Service
public class RelatedProductsService {

    private  ProductRepository productRepository;
    private ModelMapper modelMapper;


    public Page<ProductResponse> getRelatedProducts(String productId, int limit) throws ResourceNotFoundException {
        // Get the source product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Find products in the same category with similar price range
        double minPrice = product.getPrice().doubleValue() * 0.7; // 70% of product price
        double maxPrice = product.getPrice().doubleValue() * 1.3; // 130% of product price

        Page<Product> relatedProducts = productRepository.findRelatedProducts(
                product.getCategory().getId(),
                product.getId(),
                minPrice,
                maxPrice,
                PageRequest.of(0, limit)
        );

        return relatedProducts.map(relProducts -> modelMapper.map(relProducts,ProductResponse.class));
    }

 
    public Page<ProductResponse> getRecommendedProducts(String userId, int limit) {
        // Get user's purchase history and viewed products
        Page<Product> userInteractions = productRepository.findUserInteractedProducts(userId);

        // Extract categories and brands the user has shown interest in
        Set<String> categories = userInteractions.stream()
                .map(p -> p.getCategory().getId())
                .collect(Collectors.toSet());

        Set<String> brands = userInteractions.stream()
                .map(p -> p.getBrand().getId())
                .collect(Collectors.toSet());

        // Find products in similar categories and brands
        Page<Product> recommendedProducts = productRepository.findRecommendedProducts(
                categories,
                brands,
                PageRequest.of(0, limit)
        );

        return recommendedProducts.map(relProducts -> modelMapper.map(relProducts,ProductResponse.class));
    }
}