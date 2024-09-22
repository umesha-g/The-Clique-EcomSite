package com.umesha_g.store_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.umesha_g.store_backend.model.Product;
import com.umesha_g.store_backend.model.User;
import com.umesha_g.store_backend.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public List<Product> findBySeller(User seller) {
        return productRepository.findBySeller(seller);
    }

    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    public void deleteById(String id) {
        productRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Search products by query
    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    // Get search suggestions by query
    public List<String> getSearchSuggestions(String query) {
        return productRepository.findTop5ByNameContainingIgnoreCase(query)
                .stream()
                .map(Product::getName)
                .collect(Collectors.toList());
    }
}